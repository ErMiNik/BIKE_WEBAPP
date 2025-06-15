// Example: client/src/pages/Home.jsx
import { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Frontend Home Page</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}

export default Home;
