import { useState } from "react";
import { api } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { type Post } from "../types";

interface EditModalProps {
    post: Post;
    refresh: () => void;
    close: () => void;
}

export default function EditModal({ post, refresh, close }: EditModalProps) {

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const { addToast } = useToast();

    const saveChanges = async () => {
        try {
            await api.patch(`posts/${post.id}/`, {
                title,
                content
            });
            addToast("Post updated successfully! ✨", "success");
            refresh();
            close();
        } catch (error) {
            addToast("Failed to update post.", "error");
        }
    };

    return (

        <div className="modalOverlay">

            <div className="modal">

                <h2>Edit Item</h2>

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

                <div className="modalButtons">

                    <button className="btn-outline" onClick={close}>
                        Cancel
                    </button>

                    <button className="btn-success" onClick={saveChanges}>
                        Save
                    </button>

                </div>

            </div>

        </div>

    );
}