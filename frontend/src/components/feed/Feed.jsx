import React from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.scss";
import { Posts } from "../../data"; 
import { MergedPosts } from "../../data";

const Feed = () => {
  const posts = Posts; 

  return (
    <div className="feed">
      <div className="feedWrapper">
      <Share />
        {MergedPosts.filter(p => p.user).map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
