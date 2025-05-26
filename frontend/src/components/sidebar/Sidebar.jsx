import React, { useContext } from "react";
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import NomIcon from "./../../assets/icon/Heinsson.png";
import InstaIcon from "./../../assets/icon/insta.png";
import WhatsAppIcon from "./../../assets/icon/wp.png";
import CompensarIcon from "./../../assets/icon/compensar.webp";
import LinkedInIcon from "./../../assets/icon/linkedin.png";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SchoolIcon from '@mui/icons-material/School';
import SummarizeIcon from '@mui/icons-material/Summarize';
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import HandshakeIcon from '@mui/icons-material/Handshake';
import RedeemIcon from '@mui/icons-material/Redeem';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SmsIcon from '@mui/icons-material/Sms';
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import "./sidebar.scss";
import MenuLink from "../menuLink/MenuLink";
import Friends from "../friends/Friends";
import { Users } from "../../data";
import { DarkModeContext } from "./../../context/darkModeContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import MenuLink2 from "../menuLink/MenuLink2";
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <span onClick={() => dispatch({ type: "TOGGLE" })}>
          <MenuLink Icon={<Brightness4Icon />} text="Tema" />
        </span>

        <span onClick={() => signOut(auth)}>
          <MenuLink Icon={<ExitToAppOutlinedIcon />} text="Logout" />
        </span>

        <hr className="sidebarHr" />
        <span className="navbarLink">Accesos Directos</span>
        <MenuLink2
          Icon={NomIcon}
          text="Nómina, Incapacidades, Certificaciones"
          href={"https://nominasaas15.heinsohn.com.co/NominaWEB/common/mainPages/login.seam?cid=296"}
        />
        <MenuLink2 Icon={InstaIcon} text="Assa Abloy Colombia" href={"https://www.instagram.com/assaabloycol/"}/>
        <MenuLink2 Icon={WhatsAppIcon} text="Comunidad Colombia" href={"https://chat.whatsapp.com/KawjwncFit7GKtscGjHheJ"}/>
        <MenuLink2 Icon={CompensarIcon} text="Club de Bienestar Compensar"href={"https://www.tiendacompensar.com/?_gl=1*g9wy9q*_ga*NDE4ODg1NDkzLjE2ODY3MDczNDU.*_ga_X8W0BCVF42*MTcxNjU3ODE0Ni4yMy4xLjE3MTY1Nzg3NjEuNTkuMC4w*_ga_PEPKZ9HLDT*MTcxNjU3ODE0Ni4yMy4xLjE3MTY1Nzg3NjAuNjAuMC4w"}/>
        <MenuLink2 Icon={LinkedInIcon} text="Assa Abloy Colombia"href={"https://co.linkedin.com/company/assa-abloy-colombia"}/>
        <hr className="sidebarHr" />
        <span className="navbarLink">Espacios</span>
        <MenuLink Icon={<SentimentSatisfiedIcon />} text="Gestion Humana" />
        <MenuLink Icon={<SelfImprovementIcon />} text="Bienestar para Ti" />
        <MenuLink Icon={<VideocamIcon />} text="Bienvenido a Assa Más" />
        <MenuLink Icon={<SchoolIcon />} text="Capacitacion" />
        <MenuLink Icon={<CampaignIcon />} text="Noticias y Anuncios" />
        <MenuLink Icon={<InsertEmoticonIcon />} text="Work and Life Balance" />
        <MenuLink Icon={<HistoryEduIcon />} text="Entrenamientos" />
        <MenuLink Icon={<SmsIcon />} text="Comunicaciones" />
        <MenuLink Icon={<PeopleIcon />} text="Together We..." />
        <MenuLink Icon={<MedicationLiquidIcon />} text="Seguridad Salud y Ambiente" />
        <MenuLink Icon={<RedeemIcon />} text="Yale Puntos" />
        <MenuLink Icon={<HandshakeIcon />} text="Cultura OEA" />
        <MenuLink Icon={<SummarizeIcon />} text="Formatos" />
        <MenuLink Icon={<ShoppingCartIcon />} text="Descuentos y Promociones" />

        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <Friends key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
