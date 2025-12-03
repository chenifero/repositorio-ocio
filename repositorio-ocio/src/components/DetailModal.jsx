import { useEffect } from "react";
import { FaTimes, FaStar, FaCalendarAlt, FaFilm, FaGamepad, FaTv } from "react-icons/fa";

function DetailModal({ item, onClose }) {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

    // Lógica para cerrar con la tecla ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Calcular la URL de la imagen
    const posterSrc = item.Poster && item.Poster.startsWith('/') 
        ? `${IMAGE_BASE_URL}${item.Poster}` 
        : item.Poster;

    // Icono según tipo
    const TypeIcon = item.type === 'game' ? FaGamepad : item.type === 'series' ? FaTv : FaFilm;

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* stopPropagation evita que se cierre si clicas DENTRO del modal */}
            <div className="modal-content modal-detail-layout" onClick={(e) => e.stopPropagation()}>
                
                {/* BOTÓN CERRAR FLOTANTE */}
                <button className="close-btn-floating" onClick={onClose}>
                    <FaTimes />
                </button>

                {/* COLUMNA IZQUIERDA: PÓSTER */}
                <div className="detail-poster-container">
                    {posterSrc !== "N/A" ? (
                        <img src={posterSrc} alt={item.Title} className="detail-poster" />
                    ) : (
                        <div className="detail-no-poster">Sin Imagen</div>
                    )}
                </div>

                {/* COLUMNA DERECHA: INFO */}
                <div className="detail-info">
                    <div className="detail-header">
                        <span className="detail-type-badge">
                            <TypeIcon /> {item.type === 'movie' ? 'PELÍCULA' : item.type === 'series' ? 'SERIE' : 'JUEGO'}
                        </span>
                        <h2 className="detail-title">{item.Title}</h2>
                    </div>

                    <div className="detail-meta">
                        <div className="meta-item">
                            <FaCalendarAlt className="meta-icon" /> 
                            <span>{item.Year}</span>
                        </div>
                        {item.rating && item.rating !== "N/A" && (
                            <div className="meta-item">
                                <FaStar className="meta-icon star" /> 
                                <span>{item.rating}</span>
                            </div>
                        )}
                        <div className={`meta-item status-tag ${item.status === 'watched' ? 'tag-watched' : 'tag-pending'}`}>
                            {item.status === 'watched' ? 'VISTO' : 'PENDIENTE'}
                        </div>
                    </div>

                    <div className="detail-divider"></div>

                    <h3 className="detail-subtitle">SINOPSIS</h3>
                    <p className="detail-overview">
                        {item.overview || "No hay descripción disponible para este título."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DetailModal;