import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await api.get("/cinemas");
        setCinemas(response.data);
      } catch (err) {
        setError("Failed to fetch cinemas. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const cities = [...new Set(cinemas.map(cinema => cinema.city))];

  const filteredCinemas = selectedCity
    ? cinemas.filter(cinema => cinema.city === selectedCity)
    : cinemas;

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="my-6">
        <label htmlFor="city-select" className="sr-only">Select a city</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="block w-full md:w-1/3 mx-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCinemas.map((cinema) => (
          <div key={cinema.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{cinema.name}</h2>
              <p className="text-gray-600 mb-4">{cinema.address}, {cinema.city}</p>
              <Link
                to={`/cinema/${cinema.id}`}
                className="inline-block bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                View Movies
              </Link>
            </div>
          </div>
        ))}
      </div>
      {filteredCinemas.length === 0 && (
        <p className="text-center mt-10 text-gray-500">No cinemas available for the selected city.</p>
      )}
    </div>
  );
};

export default Home;
