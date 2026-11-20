// ### Lista de gêneros

// **Objetivo:** praticar `map` e `key` sozinho e entender por que a `key` precisa ser única.

// **Onde:** fora do projeto. Pode ser um arquivo de teste, como `src/Teste.jsx`, que você apaga depois.

// **O que fazer:**

// 1. Crie um array de strings com três ou quatro gêneros, por exemplo `['Ação', 'Drama', 'Comédia']`.
// 2. Mostre os gêneros em uma lista `<ul>`, usando `map` para gerar um `<li>` para cada gênero.
// 3. Use a própria string como `key` de cada `<li>`.
// 4. Agora repita um gênero no array (dois "Drama") e abra o console (F12).
const Generos = ["Ação", "Drama", "Comedia"]


export const Teste = () => {
return (
    <ul>{Generos.map((Genero) => (
<li key={Genero}>{Genero}</li>
))}
</ul>

)

};


