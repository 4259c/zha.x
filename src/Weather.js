import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "ffc4e80f7c8940a0e1f3389936064792"; // Your API key

  const getWeatherByCity = async (city) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError("City not found. Please try again.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Network error. Try again later.");
      setLoading(false);
    }
  };

  const getWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError("Unable to fetch weather from location.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather by coordinates:", err);
      setError("Geolocation error.");
      setLoading(false);
    }
  };

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setError("Location permission denied.");
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = () => {
    if (searchCity.trim() !== "") {
      getWeatherByCity(searchCity.trim());
      setSearchCity("");
    }
  };

  return (
    <div className="App">
      <h1 className="brand-title">ZHA.x0.1 Weather 🌤️</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {weather && !loading && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys?.country}
          </h2>
          <p>{weather.weather[0]?.description}</p>
          <h3>{weather.main.temp}°C</h3>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      <footer>Made with ❤️ by Shadronix</footer>
    </div>
  );
}

export default Weather;
