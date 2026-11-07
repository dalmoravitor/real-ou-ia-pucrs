
## Semana acadêmica

# 🤖 Real ou IA?

Aplicação web interativa estilo *Tinder* desenvolvida para a **Semana Acadêmica de IA — PUCRS**. O projeto desafia o olhar crítico dos usuários ao testar sua capacidade de distinguir fotografias autênticas (fauna selvagem exótica e arquitetura desconstrutivista) de imagens sintéticas geradas por modelos de difusão modernos (Midjourney, DALL-E e Stable Diffusion).

---

## 🎮 Mecânica do Jogo

- **Swipe para a Esquerda (IA 🤖):** O jogador indica que a imagem foi sintetizada por inteligência artificial.
- **Swipe para a Direita (Real 📷):** O jogador indica que a imagem é uma fotografia autêntica da natureza ou estrutura real.
- **Diagnóstico Imediato:** Ao registrar a resposta, a aplicação apresenta a justificativa visual (detalhando anomalias anatômicas, continuidade de luz/textura ou informações taxonômicas e estruturais da espécie/prédio).
- **Gamificação:** Sistema de pontuação cumulativa, contador de *streak* (sequência de acertos) e registro de recorde.
- **Mecanismo Anti-Cheat:** O cliente recebe apenas `id`, `imageUrl` e `category`. O gabarito (`is_ai`), o nome do sujeito e a explicação diagnóstica são mantidos em sigilo no servidor até o envio do palpite via requisição HTTP `POST`.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18 + TypeScript:** Interfaces declarativas e tipagem estática rigorosa.
- **Vite:** Ferramenta de build otimizada e Hot Module Replacement (HMR).
- **Framer Motion:** Animações com física de inércia, translação e rotação dinâmica vinculada ao arrasto do cursor/touch.
- **Tailwind CSS:** Estilização com design system escuro e responsivo.
- **Lucide React:** Biblioteca de ícones vetoriais.

### Backend
- **Python 3.10+:** Linguagem principal do serviço backend.
- **FastAPI:** Framework web assíncrono de alto desempenho com documentação OpenAPI (`/docs`) nativa.
- **Uvicorn:** Servidor ASGI para desenvolvimento e produção.
- **Pydantic:** Validação estrutural de dados e serialização das rotas.

---

## 📁 Estrutura de Diretórios

```text
SemanaAcademicaIA/
├── backend/
│   └── app/
│       ├── main.py               # create_app(): CORS, mídia estática e registro das rotas
│       ├── core/config.py        # Variáveis de ambiente e caminhos
│       ├── db/database.py        # Conexão SQLite e criação do schema
│       ├── schemas/              # Modelos Pydantic (contratos da API)
│       ├── repositories/         # Acesso a dados (JSON dos cards, SQLite do ranking)
│       ├── services/             # Regras de negócio
│       ├── api/routes/           # Rotas HTTP finas (cards, leaderboard)
│       └── data/                 # cards.json, videos.json, textos.json
├── frontend/src/
│   ├── types/                    # Tipos compartilhados
│   ├── config/game.ts            # Constantes do jogo e URL da API
│   ├── services/                 # Camada HTTP (cardsApi, leaderboardApi)
│   ├── utils/                    # Pontuação e identificação do participante
│   ├── hooks/                    # useGame, useLeaderboard
│   ├── components/               # SwipeCard, listas e itens reutilizáveis
│   ├── components/screens/       # StartScreen, GameScreen, GameOverScreen
│   └── App.tsx                   # Orquestra fases e sessão do jogador
├── render.yaml
└── README.md
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18+)
- **Python** (versão 3.10+)
- **Git**

---

### 1. Inicializar o Backend (FastAPI)

Abra um terminal na raiz do projeto:

```bash
cd backend

# Criar o ambiente virtual (caso não exista)
python3 -m venv venv

# Ativar o ambiente virtual
source venv/bin/activate       # No Windows: venv\Scripts\activate

# Instalar as dependências
pip install -r requirements.txt

# Iniciar a API com recarregamento automático
uvicorn app.main:app --reload --port 8000
```

- **API Base:** `http://localhost:8000`
- **Documentação Interativa (Swagger):** `http://localhost:8000/docs`

---

### 2. Inicializar o Frontend (React + Vite)

Abra um segundo terminal:

```bash
cd frontend

# Instalar os pacotes
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

- Acesse no navegador o link indicado (habitualmente `http://localhost:5173`).

---

## 🃏 Como Cadastrar Novos Desafios

Os desafios visuais são configurados no arquivo `backend/app/data/cards.json`. Para adicionar novas imagens ao baralho do jogo, adicione um item no array:

```json
{
  "id": "card-003",
  "imageUrl": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800",
  "category": "wildlife",
  "isAi": false,
  "subject": "Cegonha-bico-de-sapato (Balaeniceps rex)",
  "explanation": "Fotografia real de espécie nativa da África Central. As proporções e o alinhamento das penas na mandíbula são 100% anatômicos."
}
```

### Campos do Objeto:
- `id`: Identificador único da rodada (texto).
- `imageUrl`: Link público (Unsplash, bucket S3/Cloudflare R2) ou caminho relativo em `frontend/public/` (ex.: `/cards/minha-foto.webp`).
- `category`: `"wildlife"` para fauna ou `"architecture"` para estruturas e edifícios.
- `isAi`: `true` se gerada sinteticamente por IA, `false` se fotografia autêntica.
- `subject`: Nome do animal, monumento ou conceito renderizado.
- `explanation`: Diagnóstico visual exibido na tela de revelação após o palpite do usuário.

---

## 🌐 Deploy em Produção

### Backend no Render

O arquivo `render.yaml` já configura o serviço Python. No Render:

1. Crie um Blueprint a partir do repositório ou configure um Web Service com `backend/` como Root Directory.
2. Use `pip install -r requirements.txt` como Build Command.
3. Use `uvicorn app.main:app --host 0.0.0.0 --port $PORT` como Start Command.
4. Configure `CORS_ORIGINS` com a URL pública da Vercel, por exemplo `https://semana-academica.vercel.app`.

### Frontend na Vercel

Configure `frontend/` como Root Directory. O `vercel.json` já define o build com Vite. Adicione a variável:

```text
VITE_API_URL=https://semana-academica-api.onrender.com
```

O backend serve as imagens locais em `/media`, e o frontend converte esses caminhos para o domínio configurado em `VITE_API_URL`.

> O leaderboard ainda usa SQLite. No plano comum do Render, o disco pode ser efêmero e o ranking pode ser perdido após um redeploy ou reinício. Para produção permanente, migre o leaderboard para PostgreSQL antes do evento.

---

## 👨‍💻 Autor

Projeto desenvolvido por **Aluno da PUCRS** para a **Semana Acadêmica**.
