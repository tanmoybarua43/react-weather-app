import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureLow,
  faTemperatureHigh,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import countries from "i18n-iso-countries";

// Register English locale
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

function App() {
  // State
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState("Irvine, USA");
  const [state, setState] = useState("Irvine, USA");

  // API KEY AND URL
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`;

  const inputHandler = (event) => {
    setGetState(event.target.value);
  };

  const submitHandler = () => {
    setState(getState);
  };

  const kelvinToFahrenheit = (k) => {
    return ((k - 273.15) * 1.8 + 32).toFixed(0);
  };

  // Side effect
  useEffect(() => {
    console.log("Fetching data from:", `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Data:", data);
        setApiData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [apiUrl]);

  return (
    <div className="App">
      <header className="d-flex justify-content-center align-items-center">
        <h2>React Weather App</h2>
      </header>

      <div className="container">
        <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
          <div className="col-auto">
            <label htmlFor="location-name" className="col-form-label">
              Enter Location:
            </label>
          </div>
          <div className="col-auto">
            <input
              type="text"
              id="location-name"
              className="form-control"
              onChange={inputHandler}
              value={getState}
            />
          </div>
          <button className="btn btn-primary mt-2" onClick={submitHandler}>
            Search
          </button>
        </div>

        <div className="card mt-3 mx-auto">
          {/* Is it true data coming in from open weather based on input location */}
          {apiData.main ? (
            <div className="card-body text-center">
              {/* Added a conditional check to avoid accessing undefined properties */}
              {apiData.weather && apiData.weather.length > 0 && (
                <img
                  src={`http://openweathermap.org/img/wn/${apiData.weather[0].icon}.png`}
                  alt="weather status icon"
                />
              )}
              <p className="h2">
                {kelvinToFahrenheit(apiData.main.temp)}&deg;F
              </p>
              <p className="h5">
                <FontAwesomeIcon icon={faTemperatureLow} />
                {kelvinToFahrenheit(apiData.main.temp_min)}&deg;F
                <FontAwesomeIcon icon={faTemperatureHigh} />
                {kelvinToFahrenheit(apiData.main.temp_max)}&deg;F
              </p>
              <p className="h5">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                {apiData.name},{" "}
                {apiData.sys && apiData.sys.country
                  ? countries.getName(apiData.sys.country, "en")
                  : "Unknown Country"}
              </p>
            </div>
          ) : (
            <h1>Loading....</h1>
          )}
        </div>
      </div>

      <footer className="footer">&copy; React Weather App</footer>
    </div>
  );
}

export default App;
