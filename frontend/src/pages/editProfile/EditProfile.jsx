import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { DriveFolderUploadOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./editProfile.scss";

const EditProfile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    country: "",
    direccionLaboral: "",
    existingProfilePicture: ""
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.id) return;
    fetch(`http://localhost:3001/api/users/${currentUser.id}`)
      .then(r => r.json())
      .then(u => {
        setForm({
          name: u.name || "",
          username: u.username || "",
          email: u.email || "",
          phone: u.phone || "",
          country: u.country || "",
          direccionLaboral: u.direccionLaboral || "",
          existingProfilePicture: u.profilePicture || ""
        });
      })
      .catch(console.error);
  }, [currentUser]);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("username", form.username);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("country", form.country);
    fd.append("direccionLaboral", form.direccionLaboral);
    fd.append("existingProfilePicture", form.existingProfilePicture);
    fd.append("rol", currentUser.rol || "");
    fd.append("points", currentUser.points ?? 0);
    if (file) {
      fd.append("profilePicture", file);
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/users/${currentUser.id}`,
        { method: "PUT", body: fd }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Error actualizando perfil");
      setCurrentUser(c => ({ ...c, ...body }));
      navigate(`/profile/${body.username}`);
    } catch (err) {
      alert(err.message);
      console.error("Frontend PUT error:", err);
    }
  };

  return (
    <div className="editProfile">
      <Navbar />
      <div className="editProfileWrapper">
        <Sidebar />
        <div className="profileRight">
          <div className="profileCover">
            <img
              className="profileCoverImg"
              src="/assets/profileCover/profilecover.jpg"
              alt=""
            />
            <img
              className="profileUserImg"
              src={
                file
                  ? URL.createObjectURL(file)
                  : form.existingProfilePicture ||
                    "/assets/profileCover/DefaultProfile.jpg"
              }
              alt=""
            />
          </div>
          <div className="editprofileRightBottom">
            <div className="top">
              <h1>Edit Profile</h1>
            </div>
            <div className="bottom">
              <div className="left" />
              <div className="right">
                <form onSubmit={handleSubmit}>
                  <div className="formInput">
                    <label htmlFor="file">
                      Photo: <DriveFolderUploadOutlined className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={e => setFile(e.target.files[0])}
                    />
                  </div>
                  {[
                    { label: "Name", name: "name", type: "text" },
                    { label: "Username", name: "username", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Phone", name: "phone", type: "text" },
                    { label: "Country", name: "country", type: "text" },
                    { label: "Dirección Laboral", name: "direccionLaboral", type: "text" }
                  ].map(field => (
                    <div className="formInput" key={field.name}>
                      <label>{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                  <button type="submit" className="updateButton">
                    Guardar cambios
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
