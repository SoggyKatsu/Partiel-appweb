const URL = process.env.REACT_APP_BACKEND || "";

// Fonction pour gérer la connexion de l'utilisateur
export const login = async (username, password) => {
  const response = await fetch(`${URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: username, // Nom d'utilisateur fourni par l'utilisateur
      password: password, // Mot de passe fourni par l'utilisateur
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(`Login failed: ${data.detail}`); // Erreur si la connexion échoue
  }

  const data = await response.json();
  return data; // Retourne les données de la réponse en cas de succès
};

// Function to handle user registration
export const register = async (username, password, email, confirm_password) => {
  const response = await fetch(`${URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
      confirm_password: confirm_password,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(`Registration failed: ${data.detail}`);
  }

  const data = await response.json();
  return data;
};

// Fonction pour récupérer la liste des animes
export const fetchMovies = async () => {
  const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur

  const response = await fetch(`${URL}/movies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // Ajoute le token dans l'en-tête pour l'authentification
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`fetch failed: ${data.detail}`); // Erreur si la récupération échoue
  }

  return data; // Retourne les données des animes en cas de succès
};

export const fetchMovieById = async (id) => {
  const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur
  const response = await fetch(`${URL}/movies/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // Ajoute le token dans l'en-tête pour
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`fetch failed: ${data.detail}`); // Erreur si la récupération échoue
  }

  return data; // Retourne les données de l'anime en cas de succès
};

export const postMovieReviews = async (id, comment) => {
  const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur

  const response = await fetch(`${URL}/movies/${id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // Ajoute le token dans l'en-tête pour l'authentification
    },
    body: JSON.stringify({
      comment: comment,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`fetch failed: ${data.detail}`); // Erreur si l'ajout échoue
  }

  return data; // Retourne les données de la réponse en cas de succès
};

// Fonction pour ajouter un nouvel anime
export const postMovies = async (title, description, year, genre) => {
  const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur

  const response = await fetch(`${URL}/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // Ajoute le token dans l'en-tête pour l'authentification
    },
    body: JSON.stringify({
      title: title, // Titre de l'anime fourni par l'utilisateur
      description: description, // Description de l'anime fournie par l'utilisateur
      year: year, // Année de l'anime fournie par l'utilisateur
      genre: genre, // Genre de l'anime fourni par l'utilisateur
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`fetch failed: ${data.detail}`); // Erreur si l'ajout échoue
  }

  return data; // Retourne les données de la réponse en cas de succès
};

// Fonction pour supprimer un anime par son ID
export const deleteMovies = async (id) => {
  const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur

  const response = await fetch(`${URL}/movie/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // Ajoute le token dans l'en-tête pour l'authentification
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`fetch failed: ${data.detail}`); // Erreur si la suppression échoue
  }

  return data; // Retourne les données de la réponse en cas de succès
};
