import { useEffect, useState } from "react";
import Card from "./Card";
import { searchMoviesWithRatings } from "./getData";
import SearchModal from "./SearchModal";


function Show() {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [myCollection, setMyCollection] = useState([]); // Estado para almacenar la colección del usuario
    //función para añadir a la ccolección
    const handleAddToCollection = (item) => {
        if (myCollection.some(savedItem => savedItem.id === item.id)) {
            alert("${item.title} ya está en tu colección.");
            return;
        }
        setMyCollection([...myCollection, item]);
        setShowModal(false); // Cierra el modal después de agregar
    };

    const handleDelete = (id) => {
        const newCollection = myCollection.filter(item => item.id !== id);
        setMyCollection(newCollection);
    };



  return (
        <div className="show-container">
            <h1 className="main-title">Mi Repositorio</h1>

            {/* CONDICIONAL: Si no hay items, muestra mensaje de bienvenida */}
            {myCollection.length === 0 ? (
                <div className="empty-state">
                    <h2>Tu repositorio está vacío</h2>
                    <p>Pulsa el botón + para añadir contenido.</p>
                </div>
            ) : (
                /* Si hay items, muestra el Grid */
                <div className="grid-container">
                    {myCollection.map((item) => (
                        <div key={item.id} className="card-wrapper">
                            <Card
                                title={item.Title}
                                year={item.Year}
                                posterPath={item.Poster}
                                rating={item.rating}
                                overview={item.overview}
                            />
                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(item.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* BOTÓN (+) */}
            <button 
                className="floating-add-btn"
                onClick={() => setShowModal(true)}
            >
                +
            </button>

            {/* MODAL DE BÚSQUEDA (Solo se ve si showModal es true) */}
            {showModal && (
                <SearchModal 
                    onClose={() => setShowModal(false)} 
                    onAdd={handleAddToCollection} 
                />
            )}
        </div>
    );
}

export default Show;