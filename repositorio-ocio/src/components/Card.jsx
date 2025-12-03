import { FaRegTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";

function Card({ title, posterPath, year, rating, overview, onDelete, status, onToggleStatus }) {
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const isWatched = status === 'watched';
  
  return (
    <div className="card">
      <span className="draw-line draw-top"></span>
      <span className="draw-line draw-right"></span>
      <span className="draw-line draw-bottom"></span>
      <span className="draw-line draw-left"></span>

      <div style={{ position: 'relative' }}>
          <div className={`status-badge ${isWatched ? 'badge-watched' : 'badge-pending'}`}>
              {isWatched ? 'VISTO' : 'PENDIENTE'}
          </div>

          {posterPath && posterPath !== "N/A" ? (
            <img 
                src={posterPath.startsWith('/') ? `${IMAGE_BASE_URL}${posterPath}` : posterPath} 
                alt={title} 
            />
          ) : (
            <div className="no-poster">Sin Imagen</div>
          )}
      </div>

      <div className="card-content">
        {/* CABECERA: Título + Iconos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px' }}>
            
            <h2>{title} <span style={{fontSize:'0.8em', opacity: 0.6}}>({year})</span></h2>
            
            {/* BOTONES DE ACCIÓN */}
            {onDelete && (
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Botón OJO (Toggle Status) */}
                    <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus();
                        }}
                        className="action-icon eye-icon"
                        title={isWatched ? "Marcar como pendiente" : "Marcar como visto"}
                    >
                        {isWatched ? <FaEyeSlash /> : <FaEye />}
                    </div>

                    {/* Botón PAPELERA */}
                    <FaRegTrashAlt 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onDelete();
                        }}
                        className="action-icon trash-icon"
                        title="Eliminar"
                    />
                </div>
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