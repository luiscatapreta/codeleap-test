import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../contexts/ToastContext";

interface Props {
    refresh: () => void;
}

export default function CreatePost({ refresh }: Props) {
    const { addToast } = useToast();
    const [title, setTitle] = useState(localStorage.getItem("@codeleap:draft_title") || "");
    const [content, setContent] = useState(localStorage.getItem("@codeleap:draft_content") || "");

    useEffect(() => {
        localStorage.setItem("@codeleap:draft_title", title);
        localStorage.setItem("@codeleap:draft_content", content);
    }, [title, content]);

    const username = localStorage.getItem("username") || "anonymous";

    const createPost = async () => {
        try {
            await api.post("posts/", {
                username,
                title,
                content
            });
            setTitle("");
            setContent("");
            localStorage.removeItem("@codeleap:draft_title");
            localStorage.removeItem("@codeleap:draft_content");
            addToast("Post created successfully! 🚀", "success");
            refresh();
        } catch (error) {
            addToast("Failed to create post. Please try again.", "error");
        }
    };

    return (

        <div className="createPost">

            <h2>What's on your mind?</h2>

            <div className="form-group">
                <label>Title</label>
                <input
                    placeholder="Hello world"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Content</label>
                <textarea
                    placeholder="Content here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="button-container" style={{ gap: '10px' }}>
                <button
                    className="btn-outline"
                    type="button"
                    onClick={() => {
                        setTitle("A day in the life of a Frontend Fanatic 💻");
                        setContent("Just implemented a full @MockAPI using @LocalStorage for this @CodeLeap challenge. The @UX feels so much smoother with @Animations and @InfiniteScroll! #FrontendMasterclass");
                    }}
                    style={{ padding: '7px 16px' }}
                >
                    ✨ Magic Fill
                </button>
                <button
                    className="btn-primary"
                    disabled={!title || !content}
                    onClick={createPost}
                >
                    Create
                </button>
            </div>

        </div>

    );
}