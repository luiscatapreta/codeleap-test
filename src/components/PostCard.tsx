import { useState } from "react";
import { api } from "../services/api";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { useToast } from "../contexts/ToastContext";
import { type Post, type Comment } from "../types";

interface PostCardProps {
    post: Post;
    refresh: () => void;
}

export default function PostCard({ post, refresh }: PostCardProps) {
    const { addToast } = useToast();
    const username = localStorage.getItem("username");

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 10));
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Comment[]>([
        { id: 1, username: "codeleap_bot", content: "Nice post! 🚀" }
    ]);

    const handleLike = () => {
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
        // Simulate API call
        console.log(`Fake API Call: POST /posts/${post.id}/like/`);
        if (!liked) addToast("You liked this post! ❤️", "success");
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment = {
            id: Date.now(),
            username: username || "anonymous",
            content: commentText
        };

        setComments([...comments, newComment]);
        setCommentText("");
        // Simulate API call
        console.log(`Fake API Call: POST /posts/${post.id}/comments/`, newComment);
        addToast("Comment added! 💬", "success");
    };

    const formatContent = (content: string) => {
        const parts = content.split(/(@\w+)/g);
        return parts.map((part, i) => {
            if (part.startsWith("@")) {
                return <span key={i} className="mention">{part}</span>;
            }
            return part;
        });
    };

    const deletePost = async () => {
        try {
            await api.delete(`posts/${post.id}/`);
            addToast("Post deleted successfully.", "info");
            refresh();
            setShowDelete(false);
        } catch (error) {
            addToast("Error deleting post.", "error");
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const now = new Date();
        const past = new Date(dateStr);
        const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return past.toLocaleDateString();
    };

    return (

        <div className="postCard">

            <div className="postHeader">

                <h2>{post.title}</h2>

                {post.username === username && (

                    <div className="postActions">

                        <button onClick={() => setShowDelete(true)} title="Delete post">
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5 3L13.5 1H4.5L3.5 3H0V5H18V3H14.5ZM1 18C1 19.1 1.9 20 3 20H15C16.1 20 17 19.1 17 18V6H1V18ZM3 8H15V18H3V8Z" fill="white" />
                            </svg>
                        </button>

                        <button onClick={() => setShowEdit(true)} title="Edit post">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.4431 0.444336C15.1416 0.142436 14.7326 0 14.3059 0C13.8793 0 13.4703 0.142436 13.1687 0.444336L0.942735 12.6703C0.840742 12.7721 0.762497 12.8943 0.713583 13.0284L0.0163351 16.4949C-0.0335682 16.7447 0.0384596 17.0044 0.210452 17.2025C0.382444 17.4012 0.630095 17.5147 0.890664 17.5147C0.925064 17.5147 0.959464 17.5108 0.993863 17.503L4.47192 16.8058C4.60533 16.7568 4.72754 16.6786 4.82935 16.5768L17.0553 4.35069C17.3572 4.04949 17.4997 3.6406 17.4997 3.214C17.4997 2.78741 17.3572 2.37852 17.0553 2.07732L15.4431 0.444336ZM14.3059 1.57211L15.9329 3.19912L14.7067 4.42514L13.0797 2.79813L14.3059 1.57211ZM1.51739 13.2435L2.83944 14.5655L2.24641 15.2655L1.51739 13.2435ZM4.25412 15.658L4.25412 14.1207L12.0071 6.36768L13.5445 7.90509L5.79151 15.658H4.25412Z" fill="white" />
                            </svg>
                        </button>

                    </div>

                )}

            </div>

            <div className="postBody">

                <div className="postMeta">
                    <span className="username">@{post.username}</span>
                    <span>{getTimeAgo(post.created_datetime)}</span>
                </div>

                <div className="postContent">{formatContent(post.content)}</div>

            </div>

            <div className="postFooter">
                <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {likesCount} Likes
                </button>
                <button className="action-btn" onClick={() => setShowComments(!showComments)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    {comments.length} Comments
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    {comments.map(c => (
                        <div key={c.id} className="comment">
                            <span className="comment-author">@{c.username}</span>
                            <span>{c.content}</span>
                        </div>
                    ))}
                    <form className="form-group" style={{ marginTop: '12px', display: 'flex', gap: '8px' }} onSubmit={handleComment}>
                        <input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            style={{ margin: 0 }}
                        />
                        <button className="btn-primary" style={{ padding: '4px 16px', fontSize: '14px' }}>Post</button>
                    </form>
                </div>
            )}

            {showEdit && (
                <EditModal
                    post={post}
                    refresh={refresh}
                    close={() => setShowEdit(false)}
                />
            )}

            {showDelete && (
                <DeleteModal
                    onConfirm={deletePost}
                    onCancel={() => setShowDelete(false)}
                />
            )}

        </div>

    );
}