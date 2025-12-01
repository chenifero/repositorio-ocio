import { FaRegTrashAlt } from "react-icons/fa";

function Card({ title, posterPath, year, rating, overview, onDelete }) {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="card">
      <span className="draw-line draw-top"></span>
      <span className="draw-line draw-right"></span>
      <span className="draw-line draw-bottom"></span>
      <span className="draw-line draw-left"></span>
      {/* IMAGEN (Sin botón flotante encima) */}
      {posterPath && posterPath !== "N/A" ? (
        <img 
            // Si viene de TMDB usa la base url, si viene de OMDb/RAWG ya es una url completa
            src={posterPath.startsWith('/') ? `${IMAGE_BASE_URL}${posterPath}` : posterPath} 
            alt={title} 
        />
      ) : (
        <div className="no-poster">Sin Imagen</div>
      )}

      <div className="card-content">
        {/* CABECERA: Título + Papelera en la misma línea */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }}>
            
            <h2>{title} <span style={{fontSize:'0.8em', opacity: 0.6}}>({year})</span></h2>
            
            {/* Solo mostramos la papelera si nos pasan la función onDelete (así no sale en el buscador) */}
            {onDelete && (
                <FaRegTrashAlt 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onDelete();
                    }}
                    className="trash-icon"
                    title="Eliminar"
                />
            )}
        </div>

        {rating && rating !== "N/A" && (
          <p><strong>Rating: </strong>{rating} ⭐</p>
        )}

        <p>{overview ? overview.slice(0, 100) + "..." : "Sin descripción"}</p>
      </div>
    </div>
  );
}

export default Card;
