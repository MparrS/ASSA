import postImage from "./assets/posts/postexample.jpg";
import postImage2 from "./assets/posts/postexample2.jpg";
import userImage from "./assets/people/io.jpg";
import santi from "./assets/people/santi.jpg";

export const Users = [
  {
    id: 1,
    name: " ",
    username: "GabrielSerna",
    documento: 1019140186,
    email: "gabriel.serna@assaabloy.com",
    fechaIngreso: "08/04/2024",
    cargo: "JDE Developer",
    supervisor: 3,
    area: "TI",
    country: "Colombia",
    direccionLaboral: "",
    phone: "3028196865",
    age: 27,
    language: "Español",
    celularCorporativo: "",
    fechaNacimiento: "22/03/1998",
    estadoCivil: "soltero",
    direccionPersonal: "Calle 163 # 62-95",
    linkedIn: "",
    estado: "Activo",
    ultimoLogin: "",
    profilePicture: santi,
    password:"mamitaliz",
    points: 15,
    giftPoints: 52,
    type: "user"
  },
  {
    id: 2,
    name: "Isabella Randy",
    username: "isabel_23",
    email: "isabella@randy.biz",
    profilePicture: "/assets/person/person2.jpg",
    password:"abbloy15",
    points: 3,
    type: "user"
  },
  {
    id: 3,
    name: "Ioaira Vega Cortés",
    username: "IoairaVega",
    email: "io@rosamond.me",
    profilePicture: userImage,
    password:"assamas",
    points: 50,
    type: "admin"

  },
  {
    id: 4,
    name: "Glenna Philip",
    username: "glenna_25",
    email: "Chaim_McDermott@dana.io",
    profilePicture: "/assets/person/person4.jpg",
  },
  // {
  //   id: 5,
  //   name: "Clementina Sean",
  //   username: "Alexis",
  //   email: "Rey.Padberg@karina.biz",
  //   profilePicture: "/assets/person/person5.jpg",
  // },
];
export const Usersonline = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Gloria",
    email: "Sincere@april.biz",
    profilePicture: "/assets/person/friend1.jpg",
  }
];

export const Posts = [
  {
    userId: 3,
    id: 1,
    title: "Nuevos Ingresos",
     body: "💫Bienvenido(s) a nuestra comunidad ASSA ABLOY COLOMBIA. Aprovechamos este espacio para darle la bienvenida a todos los nuevos miembros que se unen a nuestra familia empresarial. Esperamos que disfruten de una experiencia enriquecedora y productiva aquí. 🌐¡Esperamos que se sientan bienvenidos y que tengan una gran experiencia en nuestra empresa! 🌐",
    content: [postImage, postImage2],
    date: "5 mins ago",
    like: 3,
    comment: 2,
    comments: [
      {
        id: 1,
        userId: 1,
        body: "¡Bienvenidos!",
        date: "2 mins ago",
        like: 1
      },
      {
        id: 2,
        userId: 2,
        body: "¡Qué buena noticia!",
        date: "1 min ago",
        like: 0
      }
    ]
  }
];



export const Espacios = [
  {
    userId: 3,
    id: 1,
    icono: "SentimentSatisfiedIcon",
    title: "Nuevos Ingresos",
    body: "💫Bienvenido(s) a nuestra comunidad ASSA ABLOY COLOMBIA. Aprovechamos este espacio para darle la bienvenida a todos los nuevos miembros que se unen a nuestra familia empresarial. Esperamos que disfruten de una experiencia enriquecedora y productiva aquí. 🌐¡Esperamos que se sientan bienvenidos y que tengan una gran experiencia en nuestra empresa! 🌐",
    photo: postImage,
    date: "5 mins ago",
    like: "1",
    comment: "2",
  }
];

export const MergedPosts = Posts.map(post => {
  const user = Users.find(u => u.id === post.userId);
  return {
    ...post,
    user,
  };
});

