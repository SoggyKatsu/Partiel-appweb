import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById } from "../../services/backend";
import { useState } from "react";
import { postMovieReviews } from "../../services/backend";
import "./Movie.css";

const Movie = () => {
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieById(id);
        if (data) {
          setMovie(data.details);
          setReviews(data.reviews || []);
        } else {
          alert("Movie not found");
        }
      } catch (error) {
        alert("Error fetching movie details");
      }
    };

    fetchMovie();
  }, [id, refresh]);

  const handleReviewSubmit = async () => {
    if (!comment) {
      alert("Please enter a review comment");
      return;
    }

    await postMovieReviews(movie.id, comment)
      .then(() => {
        alert("Review submitted successfully");
        setRefresh(!refresh); // Trigger a refresh to get the new review
      })
      .catch((error) => {
        alert("Error submitting review: " + error.message);
      });
  };

  return (
    <div>
      <button onClick={() => window.history.back()}>Back</button>
      <h1>Movie Page</h1>
      {movie ? (
        <div>
          <div>
            <h2>{movie.title}</h2>
            <p>description: {movie.description}</p>
            <p>Genre: {movie.genre}</p>
            <p>Release Date: {movie.year}</p>
          </div>

          <div>
            <h3>Create Review</h3>
            <textarea
              name="comment"
              placeholder="Write your review here..."
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button type="submit" onClick={handleReviewSubmit}>
              Submit Review
            </button>

            <h3>Review</h3>
            {reviews.length > 0 ? (
              <ul>
                {reviews.map((review, index) => (
                  <li key={index}>
                    <p>
                      <strong>{review.username}:</strong> {review.comment}
                    </p>
                    <p>
                      Created :{" "}
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
};

export default Movie;
