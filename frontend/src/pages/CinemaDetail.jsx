import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const CinemaDetail = () => {
  const { id } = useParams();
  const [cinema, setCinema] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCinemaDetails = async () => {
      try {
        setLoading(true);
        const cinemaResponse = await api.get(`/cinemas/${id}`);
        setCinema(cinemaResponse.data.cinema);
        setMovies(cinemaResponse.data.movies);
      } catch (err) {
        setError('Failed to fetch cinema details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemaDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading cinema details...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!cinema) {
    return <div className="text-center mt-10">Cinema not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{cinema.name}</h1>
        <p className="text-gray-600">{cinema.address}, {cinema.city}</p>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Movies Showing</h2>
      
      <div className="space-y-8">
        {movies.length > 0 ? (
          movies.map(movie => (
            <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{movie.title}</h3>
                <p className="text-gray-500 mb-4">{movie.genre} | {movie.duration} minutes</p>
                
                <div className="flex flex-wrap gap-4">
                  {movie.shows.map(show => (
                    <Link
                      key={show.id}
                      to={`/shows/${show.id}/seats`}
                      className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded-md hover:bg-red-200 transition-colors duration-300"
                    >
                      {new Date(show.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No movies are currently showing at this cinema.</p>
        )}
      </div>
    </div>
  );
};

export default CinemaDetail;
