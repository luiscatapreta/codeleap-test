import { useEffect, useState } from "react";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import "./App.css";

import { ToastProvider } from "./contexts/ToastContext";

function App() {

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");

    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <ToastProvider>
      {user ? (
        <Main />
      ) : (
        <Signup setUser={setUser} />
      )}
    </ToastProvider>
  );
}

export default App;