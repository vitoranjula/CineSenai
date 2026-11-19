export const FilmeCard = ({
  titulo,
  genero,
  duracaoMinutos,
  urlPoster,
  descricao,
}) => {
  return (
    <div className="movie-card glass glass-hover">
      <div className="movie-poster-wrapper">
        <img
          src={urlPoster}
          alt={`poster do filme ${titulo}`}
          className="movie-poster"
        />
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{titulo}</h3>
        <span className="badge badge-primary movie-badge">{genero}</span>
        <p className="movie-description">{descricao}</p>
        <div className="movie-meta movie-meta--bottom">
          <span>{duracaoMinutos} min</span>
          <span className="movie-details-link">Ver detalhes &gt;</span>
        </div>
      </div>
    </div>
  );
};

