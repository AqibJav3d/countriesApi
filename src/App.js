import "./App.css";
import Header from "./Components/Header";
import SearchIcon from "@material-ui/icons/Search";
import Countries from "./Components/Countries";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import CountryDetails from "./Components/CountryDetails";
import { useState, useEffect, useRef } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [countries, setCountries] = useState([]);
  const countriesInputRef = useRef();
  const regionRef = useRef();
  const navigate = useNavigate();
  const noCountries = countries.status || countries.message;

  const fetchData = async () => {
    const response = await fetch("https://restcountries.com/v2/all");
    const data = await response.json();

    if (data.status === 404) {
      setCountries([]);
      return;
    }

    setCountries(data);
  };

  const switchMode = () => {
    setDarkMode((prevState) => !prevState);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const searchCountries = () => {
    const searchValue = countriesInputRef.current.value;
    if (searchValue.trim()) {
      const fetchSearch = async () => {
        const response = await fetch(
          `https://restcountries.com/v2/name/${searchValue}`
        );
        const data = await response.json();

        setCountries(data);
      };
      try {
        fetchSearch();
      } catch (error) {
        console.log(error);
      }
    } else {
      fetchData();
    }
  };
  const selectRegion = () => {
    const selectValue = regionRef.current.value;
    if (selectValue.trim()) {
      const fetchSelect = async () => {
        const response = await fetch(
          `https://restcountries.com/v2/region/${selectValue}`
        );
        const data = await response.json();

        if (selectValue === "All") {
          try {
            fetchData();
          } catch (error) {
            console.log(error);
          }
          return;
        }

        setCountries(data);
      };
      try {
        fetchSelect();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const showDetails = (code) => {
    navigate(`/${code}`);
  };

  return (
    <div className={`app ${darkMode ? "darkMode" : ""}`}>
      <Header onClick={switchMode} darkMode={darkMode} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="app_body">
              <div className="inputs">
                <div className={`search_input ${darkMode ? "darkMode" : ""}`}>
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Search for a country..."
                    ref={countriesInputRef}
                    onChange={searchCountries}
                  />
                </div>
                <div className={`select_region ${darkMode ? "darkMode" : ""}`}>
                  <select ref={regionRef} onClick={selectRegion}>
                    <option>All</option>
                    <option>Africa</option>
                    <option>Asia</option>
                    <option>Americas</option>
                    <option>Europe</option>
                    <option>Oceania</option>
                  </select>
                </div>
              </div>

              <div className="countries">
                {!noCountries ? (
                  countries.map((country) => (
                    <Countries
                      darkMode={darkMode}
                      key={country.alpha3Code}
                      code={country.alpha3Code}
                      name={country.name}
                      capital={country.capital}
                      population={country.population}
                      region={country.region}
                      flag={country.flag}
                      showDetails={showDetails}
                    />
                  ))
                ) : (
                  <p>No Country Found...</p>
                )}
              </div>
            </div>
          }
        />
        <Route
          path="/:countryCode"
          element={<CountryDetails darkMode={darkMode} countries={countries} />}
        />
      </Routes>
    </div>
  );
}

export default App;
