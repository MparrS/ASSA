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

    password:"mamitaliz",
    points: 15,
    giftPoints: 52,
    type: "user"
  },

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

