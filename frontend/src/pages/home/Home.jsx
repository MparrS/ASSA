import React, { useState } from "react";
import Feed from "../../components/feed/Feed";
import Rewards from "../../components/rewards/Rewards";
import Navbar from "../../components/navbar/Navbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";

const Home = () => {
  const [view, setView] = useState("feed"); 

  return (
    <div className="home">
      <Navbar setView={setView} />
      <div className="homeContainer">
        <Sidebar />
        {view === "feed" ? <Feed /> : <Rewards/>}
        <Rightbar />
      </div>
    </div>
  );
};

export default Home;
