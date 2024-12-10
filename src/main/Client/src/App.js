import React, { useEffect, useState } from 'react';
import Axios from "axios";
import MovieCard from './MovieCard';
import './App.css';

const API_URL = "https://www.omdbapi.com?apikey=75c49904";

const App = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [watchlist, setWatchlist] = useState([]);
    const [showWatchlist, setShowWatchlist] = useState(false); // New state to toggle watchlist view

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        setMovies(data.Search);
    };

    const login = async () => {
        try {
            const response = await Axios.post("http://localhost:5000/login", { username, password });
            setToken(response.data.token);
            alert("User logged in successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const register = async () => {
        try {
            await Axios.post("http://localhost:5000/register", { username, password });
            alert("User registered successfully. Please log in.");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    const addToWatchlist = async (movie) => {
        if (watchlist.some((m) => m.imdbID === movie.imdbID)) {
            alert("Movie is already in the watchlist!");
            return;
        }

        try {
            const response = await Axios.post("http://localhost:5000/addToWatchlist", { token, movie });
            setWatchlist(response.data.watchlist);
            alert("Movie added to the watchlist!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add movie to watchlist");
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await Axios.get("http://localhost:5000/watchlist", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchlist(response.data.watchlist);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to fetch watchlist");
        }
    };

    useEffect(() => {
        if (token) fetchWatchlist();
    }, [token]);

    useEffect(() => {
        searchMovies('superman');
    }, []);

    const toggleWatchlist = () => {
        setShowWatchlist(!showWatchlist);
    };

    return (
        <div className="app">

            {/* App Content */}
            <h1 className="Heading">PrimeFlix</h1>

            {/* Top Navigation Bar */}
            <div className="navbar">
                <div className="auth-buttons">
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={login}>Login</button>
                    <button onClick={register}>Register</button>
                </div>
                {token && (
                    <button className="watchlist-button" onClick={toggleWatchlist}>
                        {showWatchlist ? "Back to Movies" : "Watchlist"}
                    </button>
                )}
            </div>

            {!showWatchlist ? (
                <div className="search">
                    <input
                        placeholder="Search for movies"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchMovies(searchTerm);
                            }
                        }}
                    />
                </div>
            ) : (
                <div>
                </div>
            )}

            {/* Conditional Rendering */}
            {showWatchlist ? (
                <div className={`watchlist-container ${showWatchlist ? "active" : ""}`}>
                    <h1 className="WatchlistTitle">Your Watchlist</h1>
                    <div className="container">
                        {watchlist.length > 0 ? (
                            watchlist.map((movie, index) => (
                                <MovieCard key={index} movie={movie} />
                            ))
                        ) : (
                            <div className="empty">
                                <h2>Your watchlist is empty!</h2>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="container">
                    {movies?.length > 0 ? (
                        movies.map((movie) => (
                            <MovieCard
                                key={movie.imdbID}
                                movie={movie}
                                addToWatchlist={addToWatchlist}
                            />
                        ))
                    ) : (
                        <div className="empty">
                            <h2>No movies found!</h2>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
