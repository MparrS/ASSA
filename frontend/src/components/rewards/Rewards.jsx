import React from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import { Posts } from "../../data"; 
import { MergedPosts } from "../../data";
import "./rewards.scss";

const Rewards = () => {
    const posts = Posts; 

    return (
        <div className="rewardsSection">
            <div className="rewardsHeader">
                <h2>💳 Billeteras</h2>
            </div>

            <div className="walletCard">
                <div className="points">
                    <span className="pointsValue">0 <strong>PTS</strong></span>
                    <span className="pointsLabel">PUNTOS</span>
                </div>
                <button className="catalogButton">📦 CATÁLOGO COLOMBIA</button>
            </div>

            <div className="offersSection">
                <h3>Ofertas activas</h3>
                <div className="noOffers">
                    <div className="tagIcon">🏷️</div>
                    <p>No hay ofertas disponibles</p>
                </div>
            </div>
        </div>

    );
};

export default Rewards;
