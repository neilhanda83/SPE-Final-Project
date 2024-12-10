import React from 'react';

const MovieCard = ({ movie, addToWatchlist }) => {
    return (
        <div className="movie">
            <div>
                <p>{movie.Year}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : "https://via.placeholder.com/400"}
                    alt={movie.Title}
                    style={{ width: "100%", height: "auto" }}
                />
            </div>

            <div>
                <span>{movie.Type}</span>
                <h3>{movie.Title}</h3>
                {addToWatchlist && (
                    <button onClick={() => addToWatchlist(movie)}>Add to Watchlist</button>
                )}
            </div>
        </div>
    );
};

export default MovieCard;