// frontend/src/components/Sidebar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SelfImprovementIcon    from "@mui/icons-material/SelfImprovement";
import VideocamIcon           from "@mui/icons-material/Videocam";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SchoolIcon             from "@mui/icons-material/School";
import CampaignIcon           from "@mui/icons-material/Campaign";
import InsertEmoticonIcon     from "@mui/icons-material/InsertEmoticon";
import HistoryEduIcon         from "@mui/icons-material/HistoryEdu";
import SmsIcon                from "@mui/icons-material/Sms";
import PeopleIcon             from "@mui/icons-material/People";
import MedicationLiquidIcon   from "@mui/icons-material/MedicationLiquid";
import RedeemIcon             from "@mui/icons-material/Redeem";
import ShoppingCartIcon       from "@mui/icons-material/ShoppingCart";
import SummarizeIcon          from "@mui/icons-material/Summarize";
import Brightness4Icon        from "@mui/icons-material/Brightness4";
import ExitToAppOutlinedIcon  from "@mui/icons-material/ExitToAppOutlined";

import NomIcon       from "./../../assets/icon/Heinsson.png";
import InstaIcon     from "./../../assets/icon/insta.png";
import WhatsAppIcon  from "./../../assets/icon/wp.png";
import CompensarIcon from "./../../assets/icon/compensar.webp";
import LinkedInIcon  from "./../../assets/icon/linkedin.png";

import MenuLink  from "../menuLink/MenuLink";
import MenuLink2 from "../menuLink/MenuLink2";
import { DarkModeContext } from "./../../context/darkModeContext";
import { signOut }         from "firebase/auth";
import { auth }            from "../../firebase";

import "./sidebar.scss";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">

        {/* Dark Mode Toggle */}
        <span onClick={() => dispatch({ type: "TOGGLE" })}>
          <MenuLink Icon={<Brightness4Icon />} text="Tema" />
        </span>

        {/* Logout */}
        <span onClick={() => signOut(auth)}>
          <MenuLink Icon={<ExitToAppOutlinedIcon />} text="Logout" />
        </span>

        <hr className="sidebarHr" />

        {/* Accesos Directos */}
        <span className="navbarLink">Accesos Directos</span>
        <MenuLink2
          Icon={NomIcon}
          text="Nómina, Incapacidades, Certificaciones"
          href="https://nominasaas15.heinsohn.com.co/NominaWEB/common/mainPages/login.seam?cid=296"
        />
        <MenuLink2
          Icon={InstaIcon}
          text="Assa Abloy Colombia"
          href="https://www.instagram.com/assaabloycol/"
        />
        <MenuLink2
          Icon={WhatsAppIcon}
          text="Comunidad Colombia"
          href="https://chat.whatsapp.com/KawjwncFit7GKtscGjHheJ"
        />
        <MenuLink2
          Icon={CompensarIcon}
          text="Club de Bienestar Compensar"
          href="https://www.tiendacompensar.com/"
        />
        <MenuLink2
          Icon={LinkedInIcon}
          text="Assa Abloy Colombia LinkedIn"
          href="https://co.linkedin.com/company/assa-abloy-colombia"
        />

        <hr className="sidebarHr" />

        {/* Espacios */}
        <span className="navbarLink">Espacios</span>

        {/* 1) Gestión Humana → spaceId = 2 */}
        <Link to="/space/1" style={{ textDecoration: "none", color: "inherit" }}>
          <MenuLink
            Icon={<SentimentSatisfiedIcon />}
            text="Gestion Humana"
          />
        </Link>

        {/* 2) Bienestar para Ti → spaceId = 3 */}
        <Link to="/space/2" style={{ textDecoration: "none", color: "inherit" }}>
          <MenuLink
            Icon={<SelfImprovementIcon />}
            text="Bienestar para Ti"
          />
        </Link>

        {/* 3) Bienvenido a Assa Más → spaceId = 4 */}
        <Link to="/space/3" style={{ textDecoration: "none", color: "inherit" }}>
          <MenuLink
            Icon={<VideocamIcon />}
            text="Bienvenido a Assa Más"
          />
        </Link>

        {/* Resto de links estáticos */}
        <MenuLink Icon={<SchoolIcon />}           text="Capacitacion" />
        <MenuLink Icon={<CampaignIcon />}         text="Noticias y Anuncios" />
        <MenuLink Icon={<InsertEmoticonIcon />}   text="Work and Life Balance" />
        <MenuLink Icon={<HistoryEduIcon />}       text="Entrenamientos" />
        <MenuLink Icon={<SmsIcon />}              text="Comunicaciones" />
        <MenuLink Icon={<PeopleIcon />}           text="Together We..." />
        <MenuLink Icon={<MedicationLiquidIcon />} text="Seguridad Salud y Ambiente" />
        <MenuLink Icon={<RedeemIcon />}           text="Yale Puntos" />
        <MenuLink Icon={<SummarizeIcon />}        text="Formatos" />
        <MenuLink Icon={<ShoppingCartIcon />}     text="Descuentos y Promociones" />

        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
      </div>
    </div>
  );
};

export default Sidebar;
