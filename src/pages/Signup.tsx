import { useState } from "react";

interface SignupProps {
    setUser: (user: string) => void;
}

/**
 * Signup component for user identification
 */
export default function Signup({ setUser }: SignupProps) {
    const [name, setName] = useState("");

    const handleEnter = () => {
        if (!name.trim()) return;
        localStorage.setItem("username", name.trim());
        setUser(name.trim());
    };

    return (

        <div className="signupContainer">

            <div className="signupBox">

                <h2>Welcome to CodeLeap network!</h2>

                <input
                    placeholder="Enter your username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <button disabled={!name} onClick={handleEnter}>
                    ENTER
                </button>

            </div>

        </div>

    );
}