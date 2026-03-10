import axios from "axios";
import { type Post, type ApiResponse } from "../types";

// Original API for reference
export const realApi = axios.create({
    baseURL: "https://dev.codeleap.co.uk/careers/"
});

// Mock API using LocalStorage for a "Frontend Only" Masterclass experience
class MockAPI {
    private STORAGE_KEY = "@codeleap:posts";

    private getPostsFromStorage(): Post[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    private savePostsToStorage(posts: Post[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    }

    private seedPosts() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialPosts: Post[] = [
                {
                    id: -1,
                    username: "CodeLeap_Expert",
                    title: "Frontend Challenge Masterclass! 🚀",
                    content: `If you really want to stand out, here are a few ideas you could implement (in addition to the core ones) to show us what you’ve got. 🌐

Check this out:
- @Likes & @Comments implemented!
- @Mentions highlighting active.
- Premium Framer-like @Animations.
- 100% Mobile @Responsive.
- Infinite @Scroll pagination.

Surprise us! :)`,
                    created_datetime: new Date().toISOString()
                }
            ];
            this.savePostsToStorage(initialPosts);
        }
    }

    async get(url: string): Promise<ApiResponse<Post>> {
        this.seedPosts();
        console.log(`%c[MockAPI] GET ${url}`, "color: #7695EC; font-weight: bold");
        await new Promise(resolve => setTimeout(resolve, 500));

        let posts = this.getPostsFromStorage();

        const params = new URLSearchParams(url.split("?")[1]);
        const search = params.get("search");
        if (search) {
            const query = search.toLowerCase();
            posts = posts.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.content.toLowerCase().includes(query) ||
                p.username.toLowerCase().includes(query)
            );
        }

        const limit = parseInt(params.get("limit") || "10");
        const offset = parseInt(params.get("offset") || "0");
        const paginated = posts.slice(offset, offset + limit);

        return {
            data: {
                results: paginated,
                count: posts.length
            }
        };
    }

    async post(url: string, data: Partial<Post>) {
        console.log(`%c[MockAPI] POST ${url}`, "color: #47B960; font-weight: bold", data);
        await new Promise(resolve => setTimeout(resolve, 800));

        const posts = this.getPostsFromStorage();
        const newPost: Post = {
            ...(data as Omit<Post, 'id' | 'created_datetime'>),
            id: Date.now(),
            created_datetime: new Date().toISOString()
        };

        this.savePostsToStorage([newPost, ...posts]);
        return { data: newPost };
    }

    async patch(url: string, data: Partial<Post>) {
        console.log(`%c[MockAPI] PATCH ${url}`, "color: #FFA500; font-weight: bold", data);
        const id = parseInt(url.split("/").filter(Boolean).pop() || "0");
        await new Promise(resolve => setTimeout(resolve, 600));

        let posts = this.getPostsFromStorage();
        posts = posts.map(p => p.id === id ? { ...p, ...data } : p);
        this.savePostsToStorage(posts);

        return { data: posts.find(p => p.id === id) };
    }

    async delete(url: string) {
        console.log(`%c[MockAPI] DELETE ${url}`, "color: #FF5151; font-weight: bold");
        const id = parseInt(url.split("/").filter(Boolean).pop() || "0");
        await new Promise(resolve => setTimeout(resolve, 600));

        let posts = this.getPostsFromStorage();
        posts = posts.filter(p => p.id !== id);
        this.savePostsToStorage(posts);

        return { data: {} };
    }
}

export const api = new MockAPI();