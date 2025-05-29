import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.scss";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/publicaciones")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar publicaciones");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {   
        setError(err.message);                          
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando publicaciones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p.id} post={p} /> 
        ))}
      </div>
    </div>
  );
};

export default Feed;
