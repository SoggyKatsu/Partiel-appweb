import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { login } from "../../services/backend";
import { useNavigate } from "react-router-dom";
import "./Loginform.css";

const LoginForm = () => {
  // Déclaration des états pour le nom d'utilisateur et le mot de passe
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Utilisation de useNavigate pour la navigation entre les pages
  const navigation = useNavigate();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    await login(username, password)
      .then((response) => {
        console.log(response); // Affiche la réponse dans la console
        alert("Connexion réussie !"); // Alerte de succès
        localStorage.setItem("token", response.token); // Stocke le token dans le localStorage
        navigation("/home"); // Redirige vers la page d'accueil
      })
      .catch((error) => {
        alert(error.message); // Affiche un message d'erreur en cas d'échec
      });
  };

  return (
    <div className="wrapper">
      <div>
        <h1>Login</h1>
        {/* Champ pour le nom d'utilisateur */}
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => {
              setUsername(e.target.value); // Met à jour l'état du nom d'utilisateur
            }}
          />
          <FaUser className="icon" /> {/* Icône utilisateur */}
        </div>
        {/* Champ pour le mot de passe */}
        <div className="input-box">
          <input
            type="password"
            placeholder="password"
            required
            onChange={(e) => {
              setPassword(e.target.value); // Met à jour l'état du mot de passe
            }}
          />
          <FaLock className="icon" /> {/* Icône cadenas */}
        </div>

        {/* Bouton de soumission */}
        <button type="submit" onClick={async () => await handleSubmit()}>
          Login
        </button>
        <button type="button" onClick={() => navigation("/register")}>
          Don't have an account?
        </button>
      </div>
    </div>
  );
};

export default LoginForm;