import { useState, useEffect } from "react";
import Card from "./Card";
import { searchUniversal } from "./getData"; 

function SearchModal({ onClose, onAdd }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("movie");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Lógica para que cuando busque el user se autocomplete, espera un poco y carga resultados
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setLoading(true);
                const data = await searchUniversal(searchTerm, searchType);
                setResults(data);
                setLoading(false);
            }
        }, 500); 

        return () => clearTimeout(timer);
    }, [searchTerm, searchType]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                
                {/*título y botón cerrar */}
                <div className="modal-header">
                    <h2>🔍 Buscar nuevo contenido</h2>
                    <button className="close-btn" onClick={onClose}>
                        ✖
                    </button>
                </div>

                <div className="search-controls">
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Escribe el título..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        className="search-select"
                        value={searchType} 
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="movie">Películas</option>
                        <option value="series">Series</option>
                        <option value="game">Juegos</option>
                    </select>
                </div>

                {/*resultados*/}
                <div className="results-grid">
                    {loading ? (
                        <p className="loading-text">Cargando...</p>
                    ) : (
                        results.map((item) => (
                            <div key={item.id} className="result-item">
                                <Card 
                                    title={item.Title} 
                                    year={item.Year} 
                                    posterPath={item.Poster} 
                                    rating={item.rating} 
                                    overview={item.overview} 
                                />
                                <button 
                                    className="add-btn"
                                    onClick={() => onAdd(item)}
                                >
                                    + AÑADIR
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;