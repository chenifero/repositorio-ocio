import { useEffect, useState } from "react";
import Card from "./Card";
import { searchMoviesWithRatings } from "./getData";


function Show() {
    const [movies, setMovies] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("movie"); // 'movie' o 'series'

    useEffect(() => {
        const fetchData = async () => {
            const results = await searchMoviesWithRatings(searchTerm, searchType);
            setMovies(results);
        };
        fetchData();
    }, [searchTerm, searchType]);


  return (
    <div className="show-container">
        <h1>busqueda pelis OMDB</h1>
        
        {/* Input para el término de búsqueda */}
        <input
            type="text"
            placeholder="Escribe el título (Ej: Star Wars)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                style={{ padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
            >
                <option value="movie">Películas</option>
                <option value="series">Series</option>
                <option value="game">Videojuegos</option>
            </select>
        
        <div className="grid-container">
            {movies.map((movie) => (
                <Card
                    key={movie.imdbID}
                    title={movie.Title}
                    year={movie.Year}
                    posterPath={movie.Poster}
                    rating={movie.rating}
                    overview={movie.overview}
                />
            ))}
        </div>
    </div>
  )
}

export default Show
