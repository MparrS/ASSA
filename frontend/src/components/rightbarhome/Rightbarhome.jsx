
import React from "react";
import "./rightbarhome.scss";
import actividadesAd from '../../assets/ads/actividades.png';
import YaleAd from '../../assets/ads/yalemas.jpeg';

const Rightbarhome = () => {
  return (
    <div className="rightbarhome">
      <div className="birthdayContainer">
        <img
          src="/assets/birthdaygifts/gift.png"
          alt=""
          className="birthdayImg"
        />
        <span className="birthdayText">
          <b>Sarah Dane</b> and <b>other friends</b> have a birthday today
        </span>
      </div>
      <a href="https://sites.google.com/gointegro.com/well-being-live-activities/mayo-maio-25?authuser=0">
        <img src={actividadesAd} alt="" className="rightbarAdvert" />
      </a>

    <a href="https://www.yalehome.com.co/">
        <img src={YaleAd} alt="" className="rightbarAdvert" />
      </a>

    </div>
  );
};

export default Rightbarhome;
