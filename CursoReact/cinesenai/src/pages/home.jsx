import "./Home.css";
import { FilmeCard } from "../components/FilmeCard";


const GENERO_LABEL = {
     COMEDIA: 'Comédia',
  DRAMA: 'Drama',
  TERROR: 'Terror',
  ROMANCE: 'Romance',
  FICCAO_CIENTIFICA: 'Ficção Científica',
  ANIMACAO: 'Animação',
  DOCUMENTARIO: 'Documentário',
  SUSPENSE: 'Suspense',
  DORAMA: 'Dorama',
  ESPORTE: 'Esporte',
  CULT: 'Cult',
  AVENTURA: 'Aventura',
  MUSICAL: 'Musical'
}

const filmes = [
  {
    id: 1,
    titulo: "Duna: Parte Dois",
    genero: "FICCAO_CIENTIFICA",
    duracaoMinutos: 166,
    urlPoster:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    descricao: "Paul Atreides une-se aos Fremen em busca de vingança.",
  },
  {
    id: 2,
    titulo: "Divertida Mente 2",
    genero: "ANIMACAO",
    duracaoMinutos: 96,
    urlPoster:
      "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    descricao: "Riley entra na adolescência e novas emoções chegam.",
  },
  {
    id: 3,
    titulo: "Oppenheimer",
    genero: "DRAMA",
    duracaoMinutos: 180,
    urlPoster:
      "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    descricao: "A história do pai da bomba atômica.",
  },
  {
    id: 4,
    titulo: "Interestelar",
    genero: "FICCAO_CIENTIFICA",
    duracaoMinutos: 169,
    urlPoster:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    descricao:
      "Exploradores viajam através de um buraco de minhoca para salvar a humanidade.",
  },
];

export const Home = () => {
  return (
    <div className="container">
      <div className="page-header catalog-header">
        <h2 className="catalog-title">Nosso Catálogo</h2>
      </div>

      <div className="movie-grid">
        {filmes.map((filme) => (
          <FilmeCard
            key={filme.id}
            titulo={filme.titulo}
            genero={GENERO_LABEL[filme.genero] || filme.genero}
            duracaoMinutos={filme.duracaoMinutos}
            urlPoster={filme.urlPoster}
            descricao={filme.descricao}
          />
        ))}
      </div>
    </div>
  );
};
