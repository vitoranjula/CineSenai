// Mock da API do CineSenai, só para testar o front. Sem dependências.
// Uso: npm run mock  (porta 8080)  +  npm run dev:mock (front apontando pra ele)
// Os dados ficam em memória: reiniciar o servidor volta ao estado inicial.
import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = 8080;

// ---------- Dados iniciais ----------
const usuarios = [
  { id: randomUUID(), nome: 'Admin', email: 'admin@cine.com', senha: '123456', cargo: 'ADMIN' },
  { id: randomUUID(), nome: 'Usuário', email: 'user@cine.com', senha: '123456', cargo: 'USUARIO' },
];

let nextId = 100;
const id = () => ++nextId;

const poster = (n) => `https://picsum.photos/seed/cine${n}/400/600`; // usado no upload fake
const tmdb = (p) => `https://image.tmdb.org/t/p/w500/${p}.jpg`;
const filmes = [
  { id: 1, titulo: 'Duna: Parte Dois', genero: 'FICCAO_CIENTIFICA', duracaoMinutos: 166, urlPoster: tmdb('1pdfLvkbY9ohJlCjQH2CZjjYVvJ'), descricao: 'Paul Atreides une-se aos Fremen em busca de vingança.' },
  { id: 2, titulo: 'Divertida Mente 2', genero: 'ANIMACAO', duracaoMinutos: 96, urlPoster: tmdb('vpnVM9B6NMmQpWeZvzLvDESb2QY'), descricao: 'Riley entra na adolescência e novas emoções chegam.' },
  { id: 3, titulo: 'Oppenheimer', genero: 'DRAMA', duracaoMinutos: 180, urlPoster: tmdb('8Gxv8gSFCU0XGDykEGv7zR1n2ua'), descricao: 'A história do pai da bomba atômica.' },
  { id: 4, titulo: 'Interestelar', genero: 'FICCAO_CIENTIFICA', duracaoMinutos: 169, urlPoster: tmdb('gEU2QniE6E77NI6lCU6MxlNBvIx'), descricao: 'Exploradores viajam através de um buraco de minhoca para salvar a humanidade.' },
  { id: 5, titulo: 'Parasita', genero: 'SUSPENSE', duracaoMinutos: 132, urlPoster: tmdb('7IiTTgloJzvGI1TAYymCfbfl3vT'), descricao: 'Uma família pobre se infiltra na casa de uma família rica.' },
  { id: 6, titulo: 'Batman: O Cavaleiro das Trevas', genero: 'ACAO', duracaoMinutos: 152, urlPoster: tmdb('qJ2tW6WMUDux911r6m7haRef0WH'), descricao: 'Batman enfrenta o Coringa, que mergulha Gotham no caos.' },
  { id: 7, titulo: 'Barbie', genero: 'COMEDIA', duracaoMinutos: 114, urlPoster: tmdb('iuFNMS8U5cb6xfzi51Dbkovj7vM'), descricao: 'Barbie deixa a Barbieland e descobre o mundo real.' },
];

const gerarAssentos = (fileiras, porFileira) => {
  const out = [];
  for (let f = 0; f < fileiras; f++)
    for (let n = 1; n <= porFileira; n++)
      out.push({ id: id(), fileira: String.fromCharCode(65 + f), numero: n });
  return out;
};
const salas = [
  { id: 1, nome: 'Sala 1', fileiras: 5, assentosPorFileira: 8, totalAssentos: 40 },
  { id: 2, nome: 'Sala 2 (VIP)', fileiras: 3, assentosPorFileira: 6, totalAssentos: 18 },
];
const assentosPorSala = { 1: gerarAssentos(5, 8), 2: gerarAssentos(3, 6) };

// Horário de parede com Z no final, como o back-end de verdade devolve (o front mostra com timeZone: 'UTC').
const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('.')[0] + 'Z';
const comZ = (t) => (typeof t === 'string' && !t.endsWith('Z') ? t + 'Z' : t);
const hoje = (h, m = 0, addDias = 0) => {
  const d = new Date(); d.setDate(d.getDate() + addDias); d.setHours(h, m, 0, 0); return d;
};
const sessoes = [];
const addSessao = (filmeId, salaId, inicio, preco) => {
  const filme = filmes.find((f) => f.id === filmeId);
  sessoes.push({
    id: id(), filmeId, salaId, preco,
    inicio: iso(inicio),
    fim: iso(new Date(inicio.getTime() + filme.duracaoMinutos * 60000)),
  });
};
addSessao(1, 1, hoje(14), 30); addSessao(1, 2, hoje(19, 30), 45);
addSessao(2, 1, hoje(16), 25); addSessao(3, 2, hoje(21), 40);
addSessao(1, 1, hoje(15, 0, 1), 30); addSessao(3, 1, hoje(20, 0, 1), 35);
addSessao(4, 1, hoje(18), 32); addSessao(5, 2, hoje(17), 38);
addSessao(6, 1, hoje(21), 30); addSessao(7, 2, hoje(15), 28);
addSessao(4, 2, hoje(19, 0, 1), 35); addSessao(7, 1, hoje(16, 0, 1), 28);

const reservas = []; // { id, usuarioId, sessaoId, assentoIds, status, criadoEm }
const avaliacoes = {}; // filmeId -> []

// ---------- Helpers ----------
const sessaoCompleta = (s) => ({
  id: s.id, inicio: s.inicio, fim: s.fim, preco: s.preco,
  filme: filmes.find((f) => f.id === s.filmeId),
  sala: salas.find((x) => x.id === s.salaId),
});
const ocupados = (sessaoId) =>
  new Set(reservas.filter((r) => r.sessaoId === sessaoId && r.status === 'ATIVA').flatMap((r) => r.assentoIds));
const reservaCompleta = (r) => {
  const s = sessoes.find((x) => x.id === r.sessaoId);
  const todos = s ? assentosPorSala[s.salaId] || [] : [];
  return {
    id: r.id, status: r.status, criadoEm: r.criadoEm,
    usuarioNome: usuarios.find((u) => u.id === r.usuarioId)?.nome,
    sessao: s ? sessaoCompleta(s) : null,
    assentos: todos.filter((a) => r.assentoIds.includes(a.id)),
  };
};

// Token fake: base64 de "uuid|cargo"
const gerarToken = (u) => Buffer.from(`${u.id}|${u.cargo}`).toString('base64');
const usuarioDoToken = (req) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  const [uid] = Buffer.from(h.slice(7), 'base64').toString().split('|');
  return usuarios.find((u) => u.id === uid) || null;
};

class HttpError extends Error {
  constructor(status, mensagem) { super(mensagem); this.status = status; }
}
const exigeLogin = (req) => usuarioDoToken(req) || (() => { throw new HttpError(401, 'Não autenticado.'); })();
const exigeAdmin = (req) => {
  const u = exigeLogin(req);
  if (u.cargo !== 'ADMIN') throw new HttpError(403, 'Acesso negado.');
  return u;
};
const achar = (lista, i, nome) => lista.find((x) => x.id === Number(i)) || (() => { throw new HttpError(404, `${nome} não encontrado(a).`); })();

// ---------- Rotas ----------
// Cada rota: [método, regex, handler(req, match, body, query)] → retorna [status, corpo]
const rotas = [
  ['POST', /^\/api\/auth\/login$/, (req, m, b) => {
    const u = usuarios.find((x) => x.email === b.email && x.senha === b.senha);
    if (!u) throw new HttpError(401, 'E-mail ou senha inválidos.');
    return [200, { token: gerarToken(u), nome: u.nome, cargo: u.cargo }];
  }],
  ['POST', /^\/api\/auth\/cadastro$/, (req, m, b) => {
    if (!b.nome || !b.email || !b.senha) throw new HttpError(400, 'Preencha todos os campos.');
    if (usuarios.some((x) => x.email === b.email)) throw new HttpError(409, 'E-mail já cadastrado.');
    const u = { id: randomUUID(), nome: b.nome, email: b.email, senha: b.senha, cargo: 'USUARIO' };
    usuarios.push(u);
    console.log(`  → novo usuário ${u.email} (id ${u.id})`);
    return [201, { token: gerarToken(u), nome: u.nome, cargo: u.cargo }];
  }],

  // Filmes
  ['GET', /^\/api\/filmes$/, () => [200, filmes]],
  ['GET', /^\/api\/filmes\/(\d+)$/, (req, m) => [200, achar(filmes, m[1], 'Filme')]],
  ['POST', /^\/api\/filmes$/, (req, m, b) => { exigeAdmin(req); const f = { id: id(), ...b }; filmes.push(f); return [201, f]; }],
  ['PUT', /^\/api\/filmes\/(\d+)$/, (req, m, b) => { exigeAdmin(req); const f = achar(filmes, m[1], 'Filme'); Object.assign(f, b, { id: f.id }); return [200, f]; }],
  ['DELETE', /^\/api\/filmes\/(\d+)$/, (req, m) => { exigeAdmin(req); filmes.splice(filmes.indexOf(achar(filmes, m[1], 'Filme')), 1); return [204, null]; }],
  ['POST', /^\/api\/filmes\/(\d+)\/imagem$/, (req, m) => {
    exigeAdmin(req); const f = achar(filmes, m[1], 'Filme');
    f.urlPoster = poster(`up${Date.now()}`); // não grava o arquivo: só troca por uma imagem aleatória
    return [200, f];
  }],
  ['DELETE', /^\/api\/filmes\/(\d+)\/imagem$/, (req, m) => { exigeAdmin(req); const f = achar(filmes, m[1], 'Filme'); f.urlPoster = null; return [200, f]; }],

  // Avaliações
  ['GET', /^\/api\/filmes\/(\d+)\/avaliacoes$/, (req, m) => [200, avaliacoes[m[1]] || []]],
  ['POST', /^\/api\/filmes\/(\d+)\/avaliacoes$/, (req, m, b) => {
    const u = exigeLogin(req); achar(filmes, m[1], 'Filme');
    if (!(b.nota >= 1 && b.nota <= 5)) throw new HttpError(400, 'A nota deve ser de 1 a 5.');
    const a = { id: id(), nota: b.nota, comentario: b.comentario, usuarioNome: u.nome, criadoEm: iso(new Date()) };
    (avaliacoes[m[1]] ||= []).unshift(a);
    return [201, a];
  }],

  // Salas
  ['GET', /^\/api\/salas$/, () => [200, salas]],
  ['GET', /^\/api\/salas\/(\d+)$/, (req, m) => [200, achar(salas, m[1], 'Sala')]],
  ['POST', /^\/api\/salas$/, (req, m, b) => {
    exigeAdmin(req);
    const s = { id: id(), nome: b.nome, fileiras: b.fileiras, assentosPorFileira: b.assentosPorFileira, totalAssentos: b.fileiras * b.assentosPorFileira };
    salas.push(s); assentosPorSala[s.id] = gerarAssentos(b.fileiras, b.assentosPorFileira);
    return [201, s];
  }],
  ['DELETE', /^\/api\/salas\/(\d+)$/, (req, m) => {
    exigeAdmin(req); const s = achar(salas, m[1], 'Sala');
    if (sessoes.some((x) => x.salaId === s.id)) throw new HttpError(409, 'Sala possui sessões vinculadas.');
    salas.splice(salas.indexOf(s), 1); return [204, null];
  }],

  // Sessões
  ['GET', /^\/api\/sessoes$/, (req, m, b, q) => {
    let l = sessoes;
    if (q.get('data')) l = l.filter((s) => s.inicio.startsWith(q.get('data')));
    if (q.get('filmeId')) l = l.filter((s) => s.filmeId === Number(q.get('filmeId')));
    return [200, l.map(sessaoCompleta)];
  }],
  ['GET', /^\/api\/sessoes\/(\d+)\/assentos$/, (req, m) => {
    const s = achar(sessoes, m[1], 'Sessão'); const oc = ocupados(s.id);
    return [200, (assentosPorSala[s.salaId] || []).map((a) => ({ ...a, disponivel: !oc.has(a.id) }))];
  }],
  ['GET', /^\/api\/sessoes\/(\d+)$/, (req, m) => [200, sessaoCompleta(achar(sessoes, m[1], 'Sessão'))]],
  ['POST', /^\/api\/sessoes$/, (req, m, b) => {
    exigeAdmin(req); achar(filmes, b.filmeId, 'Filme'); achar(salas, b.salaId, 'Sala');
    const s = { id: id(), filmeId: Number(b.filmeId), salaId: Number(b.salaId), inicio: comZ(b.inicio), fim: comZ(b.fim), preco: b.preco };
    sessoes.push(s); return [201, sessaoCompleta(s)];
  }],
  ['DELETE', /^\/api\/sessoes\/(\d+)$/, (req, m) => { exigeAdmin(req); sessoes.splice(sessoes.indexOf(achar(sessoes, m[1], 'Sessão')), 1); return [204, null]; }],

  // Reservas
  ['POST', /^\/api\/reservas$/, (req, m, b) => {
    const u = exigeLogin(req); const s = achar(sessoes, b.sessaoId, 'Sessão');
    if (!b.assentoIds?.length) throw new HttpError(400, 'Selecione ao menos um assento.');
    const oc = ocupados(s.id);
    if (b.assentoIds.some((a) => oc.has(a))) throw new HttpError(409, 'Algum assento já foi reservado.');
    const r = { id: id(), usuarioId: u.id, sessaoId: s.id, assentoIds: b.assentoIds, status: 'ATIVA', criadoEm: iso(new Date()) };
    reservas.push(r); return [201, reservaCompleta(r)];
  }],
  ['GET', /^\/api\/reservas\/minhas$/, (req) => { const u = exigeLogin(req); return [200, reservas.filter((r) => r.usuarioId === u.id).map(reservaCompleta)]; }],
  ['DELETE', /^\/api\/reservas\/(\d+)$/, (req, m) => {
    const u = exigeLogin(req); const r = achar(reservas, m[1], 'Reserva');
    if (r.usuarioId !== u.id && u.cargo !== 'ADMIN') throw new HttpError(403, 'Acesso negado.');
    r.status = 'CANCELADA'; return [204, null];
  }],

  // Admin
  ['GET', /^\/api\/admin\/reservas$/, (req) => { exigeAdmin(req); return [200, reservas.map(reservaCompleta)]; }],
  ['GET', /^\/api\/admin\/relatorios$/, (req) => {
    exigeAdmin(req);
    const ativas = reservas.filter((r) => r.status === 'ATIVA');
    const totalReceita = ativas.reduce((t, r) => t + (sessoes.find((s) => s.id === r.sessaoId)?.preco || 0) * r.assentoIds.length, 0);
    return [200, {
      totalReservas: ativas.length, totalReceita,
      filmes: filmes.map((f) => ({
        nomeFilme: f.titulo,
        totalReservas: ativas.filter((r) => sessoes.find((s) => s.id === r.sessaoId)?.filmeId === f.id).length,
      })),
    }];
  }],
  ['PATCH', /^\/api\/admin\/usuarios\/([\w-]+)\/promover$/, (req, m) => {
    exigeAdmin(req); const u = usuarios.find((x) => x.id === m[1]);
    if (!u) throw new HttpError(404, 'Usuário não encontrado.');
    u.cargo = 'ADMIN'; return [200, { id: u.id, nome: u.nome, cargo: u.cargo }];
  }],
];

// ---------- Servidor ----------
const lerBody = (req) => new Promise((resolve) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    if ((req.headers['content-type'] || '').includes('application/json')) {
      try { return resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); } catch { /* cai no {} */ }
    }
    resolve({});
  });
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const enviar = (status, corpo) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(corpo === null ? undefined : JSON.stringify(corpo));
  };
  try {
    const body = await lerBody(req);
    for (const [metodo, re, handler] of rotas) {
      const m = req.method === metodo && url.pathname.match(re);
      if (m) {
        const [status, corpo] = handler(req, m, body, url.searchParams);
        console.log(`${req.method} ${req.url} → ${status}`);
        return enviar(status, corpo);
      }
    }
    console.log(`${req.method} ${req.url} → 404 (rota não existe)`);
    enviar(404, { mensagem: 'Rota não encontrada.' });
  } catch (e) {
    const status = e.status || 500;
    console.log(`${req.method} ${req.url} → ${status} ${e.message}`);
    enviar(status, { mensagem: e.message });
  }
}).listen(PORT, () => {
  console.log(`Mock da API em http://localhost:${PORT}`);
  console.log('  ADMIN: admin@cine.com / 123456');
  console.log('  USER : user@cine.com  / 123456');
});
