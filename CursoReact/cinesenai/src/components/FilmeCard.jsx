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
        {urlPoster ? (
          <img
            src={urlPoster}
            alt={`Pôster do filme ${titulo}`}
            className="movie-poster"
          />
        ) : (
          <div className="movie-poster-fallback">
            <span>{titulo}</span>
          </div>
        )}
      </div>
      {/* <div className="movie-poster-wrapper">
  {urlPoster ? (
    <img src={urlPoster} alt={`Poster do filme: ${titulo}`}  className="movie-poster-fallback"/>)
  )} */}

      {/* </div> */}
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
