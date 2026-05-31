# Poc Quyro CRUD

Projeto simples com CRUD full stack:

- `backend`: API REST em Node.js + Express
- `frontend`: interface em React + Vite
- GitHub Actions separados para validar front-end e back-end

## Como rodar localmente

### Back-end

```bash
cd backend
npm install
npm run dev
```

A API fica em `http://localhost:3000`.

### Front-end

```bash
cd frontend
npm install
npm run dev
```

O front fica em `http://localhost:5173`.

## Endpoints

- `GET /health`
- `GET /items`
- `GET /items/:id`
- `POST /items`
- `PUT /items/:id`
- `DELETE /items/:id`
