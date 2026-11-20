import "./Home.css";
import { FilmeCard } from "../components/FilmeCard";


const GENERO_LABELS = {
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

      {/* <div className="movie-grid">
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
      </div> */}
<p>{filmes.length} {filmes.length === 1 ? "filme" : "filmes"} Em cartaz</p>
{filmes.length > 0 ? (  
  <div className="movie-grid">
    {filmes.map((filme) => (
      <FilmeCard
        key={filme.id}
        titulo={filme.titulo}
        genero={GENERO_LABELS[filme.genero] || filme.genero}
        duracaoMinutos={filme.duracaoMinutos}
        urlPoster={filme.urlPoster}
        descricao={filme.descricao}
      />
    ))}
  </div>
  ) : (
    <div className="glass home-empty">
<svg className="home-empty-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
    <h3 className="home-empty-title">Nenhum filme encontrado</h3>
    <p className="home-empty-text">Tente alterar os termos da busca ou selecionar outro gênero.</p>
    </div>
  )}
  </div>
  );
};



// ### Lista de gêneros

// **Objetivo:** praticar `map` e `key` sozinho e entender por que a `key` precisa ser única.

// **Onde:** fora do projeto. Pode ser um arquivo de teste, como `src/Teste.jsx`, que você apaga depois.

// **O que fazer:**

// 1. Crie um array de strings com três ou quatro gêneros, por exemplo `['Ação', 'Drama', 'Comédia']`.
// 2. Mostre os gêneros em uma lista `<ul>`, usando `map` para gerar um `<li>` para cada gênero.
// 3. Use a própria string como `key` de cada `<li>`.
// 4. Agora repita um gênero no array (dois "Drama") e abra o console (F12).