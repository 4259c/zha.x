import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "ffc4e80f7c8940a0e1f3389936064792"; // Your API key

  // Function to fetch weather by city name
  const getWeatherByCity = async (city) => {
    setLoading(true);
    try {
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
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch weather by coordinates
  const getWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
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
    } catch (err) {
      console.error("Error fetching weather by coordinates:", err);
      setError("Geolocation error.");
    } finally {
      setLoading(false);
    }
  };

  // Get the location of the user using geolocation
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
    getLocation();  // Fetch weather based on user's location on load
  }, [getLocation]);

  // Search for weather based on city input
  const handleSearch = () => {
    if (searchCity.trim() !== "") {
      getWeatherByCity(searchCity.trim());
    }
  };

  // Weather Icon function (you can update it with more icons based on conditions)
  const weatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
        return "🌧️";
      case "Snow":
        return "❄️";
      case "Thunderstorm":
        return "⚡";
      default:
        return "🌤️";
    }
  };

  return (
    <div className={`App ${weather ? weather.weather[0]?.main.toLowerCase() : "default"}`}>
      <h1 className="brand-title">ZHA.x0.1 Weather 🌤️</h1>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Error and Loading State */}
      {error && <p className="error">{error}</p>}
      {loading && <div className="loading-spinner">Loading...</div>}

      {/* Weather Display */}
      {weather && !loading && (
        <div className="weather-container">
          <h2>Weather in {weather.name}, {weather.sys.country}</h2> {/* Display City Name */}
          <div className="weather-condition">
            <h2>
              {weatherIcon(weather.weather[0]?.main)} {weather.weather[0]?.main}
            </h2>
            <p>{weather.weather[0]?.description}</p>
          </div>

          <div className="card small">
            <h3>Temperature</h3>
            <p>{weather.main.temp}°C</p>
          </div>

          <div className="card small">
            <h3>Humidity</h3>
            <p>{weather.main.humidity}%</p>
          </div>

          <div className="card small">
            <h3>Wind Speed</h3>
            <p>{weather.wind.speed} m/s</p>
          </div>
        </div>
      )}

      <footer>Made with ❤️ by Shadronix</footer>
    </div>
  );
}

export default App;
