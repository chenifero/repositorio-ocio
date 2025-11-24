function Card({ title, posterPath, year, rating, overview }) {
  return (
    <div className="card">
      {/*IMAGEN*/}
      {posterPath && posterPath !== "N/A" ? (
        <img src={posterPath} alt={title} />
      ) : (
        <div className="no-poster">No Image Available</div>
      )}

      {/*CONTENIDO*/}
      <div className="card-content">
        <h2>
          {title} ({year})
        </h2>

        {/*VALORACIÓN*/}
        {rating && rating !== "N/A" && (
          <p>
            <strong>Rating: </strong>
            {rating} ⭐
          </p>
        )}

        {/* SINOPSIS */}
        <p>
          {" "}
          {overview
            ? overview.slice(0, 150) + "..."
            : "No overview available"}{" "}
        </p>
      </div>
    </div>
  );
}

export default Card;
