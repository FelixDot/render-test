import { useEffect, useState } from "react";
import axios from "axios";

const Weather = ({ weather }) => {
  return (
    <>
      <h1>Weather in {weather.name}</h1>
      <p>temperature {weather.main.feels_like}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      ></img>
      <p>wind {weather.wind.speed} m/s</p>
    </>
  );
};
const CountryList = ({ countries, show }) => {
  return (
    <ul>
      {countries.map((country) => (
        <p key={country.cca2}>
          {country.name.common}
          <button
            key={country.cca2}
            onClick={() => {
              show(country);
            }}
          >
            show
          </button>
        </p>
      ))}
    </ul>
  );
};

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryInfo, setCountryInfo] = useState(null);
  const [notification, setNotification] = useState("");
  const [weather, setWeather] = useState();
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (countryInfo) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${countryInfo.capital}&appid=${apiKey}&units=metric`;
      axios.get(url).then((res) => {
        console.log(res.data);
        setWeather(res.data);
      });
    }
  }, [countryInfo]);

  useEffect(() => {
    if (searchQuery === "") {
      setCountries([]);
      setCountryInfo(null);
      return;
    }
    axios
      .get(`https://restcountries.com/v3/name/${searchQuery}`)
      .then((response) => {
        const data = response.data;
        if (data.length === 1) {
          // Only one country found, show detailed information
          setCountryInfo(data[0]);
          setCountries([]);
        } else if (data.length <= 10) {
          // Multiple countries found, show list
          setCountries(data);
          setCountryInfo(null);
          setNotification(null);
        } else {
          // Too many results, ask user to be more specific
          setCountries([]);
          setCountryInfo(null);
          setNotification("Too many matches, specify another filter");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [searchQuery]);

  const handleInput = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.value);
  };

  const showCountry = (country) => {
    setCountryInfo(country);
    setCountries([]);
  };
  return (
    <>
      <span>find countries</span>
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => handleInput(event)}
      ></input>
      <p>{notification}</p>
      {countryInfo && (
        <div>
          <h1>{countryInfo.name.common}</h1>
          <p>Capital: {countryInfo.capital}</p>
          <p>Area: {countryInfo.area} </p>
          <h2>Languages: </h2>
          {Object.values(countryInfo.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
          <img
            src={countryInfo.flags[1]}
            alt={`${countryInfo.flags.alt} Flag`}
          />
        </div>
      )}
      {weather && <Weather weather={weather} />}

      <CountryList countries={countries} show={showCountry} />
    </>
  );
};

export default Countries;
