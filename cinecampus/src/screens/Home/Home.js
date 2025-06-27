import { useEffect, useState } from "react";
import { deleteMovies, fetchMovies, postMovies } from "../../services/backend";
import { GrEdit } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  // États pour les champs de formulaire et la liste d'animes
  const [title, setTitle] = useState(""); // Titre à ajouter
  const [description, setDescription] = useState(""); // Description à ajouter
  const [year, setYear] = useState(""); // Année à ajouter
  const [genre, setGenre] = useState(""); // Genre à ajouter
  const [movies, setMovies] = useState(undefined); // Liste des animes (ou undefined si pas encore chargée)
  const [refresh, setRefresh] = useState(false); // Booléen pour déclencher un rechargement des données
  const navigation = useNavigate();


  // useEffect se déclenche à chaque changement de "refresh"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMovies(); // Appel API pour récupérer les animes
        setMovies(data.map((item) => ({ ...item, openEdit: false }))); // On ajoute une propriété "openEdit" pour gérer l'affichage du champ d'édition
      } catch (error) {
        alert(error.message); // Affiche une erreur si l'appel échoue
      }
    };

    fetchData(); // Appel initial ou lors du changement de "refresh"
  }, [refresh]);

  // Ajouter un nouvel anime
  const handleAddMovie = async () => {
    try {
      await postMovies(title, description, year, genre); // Appel API pour ajouter
      setRefresh((prev) => !prev); // Rafraîchit la liste
      setTitle(""); // Réinitialise le champ titre
      setDescription(""); // Réinitialise le champ description
    } catch (error) {
      alert(error.message); // Affiche une erreur si l’ajout échoue
    }
  };

  const handleMovieDetail = (id) => {
    navigation(`/movie/${id}`); // Redirige vers la page de détails du film
  };

  return (
    <div className="home-wrapper">
      <h1>Welcome to the Home Page</h1>
      <div className="input-box">
        <input
          value={title}
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="input-box">
        <input
          value={description}
          type="text"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="input-box">
        <input
          value={year}
          type="number"
          placeholder="year"
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="input-box">
        <input
          value={genre}
          type="text"
          placeholder="genre"
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <button onClick={handleAddMovie}>Add movies</button>{" "}
      {/* Bouton pour ajouter un movie */}
      <p>Here is a list of movies:</p>
      <ul>
        {/* Affiche la liste des animes ou "Loading..." si non encore chargée */}
        {movies ? (
          movies.map((item) => (
            <li key={item.id}>
              <div className="movie-edit">
                <h2 className="movie-space">{item.title}</h2>
              </div>
              <p>{item.year}</p>
              <p>{item.genre}</p>
              <button onClick={() => handleMovieDetail(item.id)}>
                details
              </button>
            </li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
      {/* Bouton pour se déconnecter */}
      <button
        onClick={() => {
          localStorage.removeItem("token"); // Supprime le token JWT
          window.location.href = "/login"; // Redirige vers la page de connexion
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
