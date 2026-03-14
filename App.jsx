import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('Delhi'); // default city
  const [searchCity, setSearchCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = '5e6dd2df84e06a2891185e3f7d9fd8ad'; // your API key

  // Fetch current weather
  const fetchCurrentWeather = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setCurrentWeather(data);
        setError(null);
      } else {
        setCurrentWeather(null);
        setError(data.message);
      }
    } catch {
      setCurrentWeather(null);
      setError('Failed to fetch current weather');
    }
  };

  // Fetch 5-day forecast
  const fetchForecast = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === '200') {
        // Get daily forecast at 12:00 PM
        const dailyForecast = data.list.filter((item) =>
          item.dt_txt.includes('12:00:00')
        );
        setForecast(dailyForecast);
      } else {
        setForecast([]);
      }
    } catch {
      setForecast([]);
    }
  };

  // Fetch data when city changes
  useEffect(() => {
    fetchCurrentWeather(city);
    fetchForecast(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim() !== '') {
      setCity(searchCity);
      setSearchCity('');
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {currentWeather && (
        <div className="current-weather">
          <h2>
            {currentWeather.name}, {currentWeather.sys.country}
          </h2>
          <p>Temperature: {currentWeather.main.temp}°C</p>
          <p>Humidity: {currentWeather.main.humidity}%</p>
          <p>Condition: {currentWeather.weather[0].description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-cards">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <p>Temp: {day.main.temp}°C</p>
                <p>{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;