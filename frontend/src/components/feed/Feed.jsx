import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Post from "../post/Post";
import Share from "../share/Share";
import { AuthContext } from "../../context/AuthContext";
import "./feed.scss";

const Feed = () => {
  const { currentUser } = useContext(AuthContext);
  const { spaceId } = useParams();
  const [posts, setPosts] = useState([]);
  const [space, setSpace] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:3001/api/posts");
      const data = await res.json();
      setPosts(spaceId ? data.filter(p=>p.spaceId===+spaceId) : data);
    };
    fetchPosts();
  }, [spaceId]);

  useEffect(() => {
    if (!spaceId) return setSpace(null);
    const fetchSpace = async () => {
      const res = await fetch(`http://localhost:3001/api/spaces/${spaceId}`);
      setSpace(await res.json());
    };
    fetchSpace();
  }, [spaceId]);

  const isGlobalAdmin = currentUser?.rol==="admin";
  const isSpaceAdmin = space?.userId===currentUser?.id;

  return (
    <div className="feed">
      <div className="feedWrapper">
        {space && (
          <div className="spaceHeader">
            <img
              className="spaceCover"
              src={space.coverImage||"/defaultCover.jpg"}
              alt="Portada"
            />
            <div className="spaceInfo">
              <img
                className="spaceIcon"
                src={space.icon||"/defaultIcon.png"}
                alt="Icono"
              />
              <div className="spaceText">
                <h2>{space.name}</h2>
                <p>{space.description}</p>
              </div>
            </div>
          </div>
        )}

        {((!space && isGlobalAdmin) || (space && isSpaceAdmin)) && <Share />}

        {posts.length > 0 ? (
          posts.map(p => <Post key={p.id} post={p} />)
        ) : (
          <div className="noPosts">
            <center>No se encontraron publicaciones</center>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
