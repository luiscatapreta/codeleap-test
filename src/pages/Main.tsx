import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import SkeletonPost from "../components/SkeletonPost";
import { type Post, type Theme } from "../types";

export default function Main() {

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [theme, setTheme] = useState<Theme>((localStorage.getItem("theme") as Theme) || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const getPosts = useCallback(async (currentOffset: number, append = false, query = "") => {
        setLoading(true);
        try {
            const url = `posts/?limit=10&offset=${currentOffset}${query ? `&search=${query}` : ""}`;
            const res = await api.get(url);
            const newPosts = res.data.results;

            if (newPosts.length === 0 && currentOffset !== 0) {
                setHasMore(false);
            } else {
                setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
                setHasMore(newPosts.length === 10);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setOffset(0);
            setHasMore(true);
            getPosts(0, false, search);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, getPosts]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostElementRef = useCallback((node: any) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                const nextOffset = offset + 10;
                setOffset(nextOffset);
                getPosts(nextOffset, true, search);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, offset, getPosts, search]);

    return (
        <div className="container">

            <header className="header">
                <h1>CodeLeap Network</h1>
                <button
                    className="theme-toggle"
                    onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                    title="Toggle Dark Mode"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </header>

            <div className="main-content">

                <CreatePost refresh={() => { setOffset(0); getPosts(0, false, search); }} />

                <div className="search-bar">
                    <input
                        placeholder="🔍 Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <div ref={lastPostElementRef} key={post.id}>
                                <PostCard post={post} refresh={() => getPosts(0, false, search)} />
                            </div>
                        );
                    } else {
                        return <PostCard key={post.id} post={post} refresh={() => getPosts(0, false, search)} />;
                    }
                })}

                {loading && (
                    <>
                        <SkeletonPost />
                        <SkeletonPost />
                    </>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className="loading-trigger">
                        No more posts to show.
                    </div>
                )}

            </div>

        </div>
    );
}