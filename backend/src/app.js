import cors from 'cors';
import express from 'express';

const app = express();

let nextId = 3;
const items = [
  { id: 1, name: 'Notebook', description: 'Equipamento para trabalho remoto' },
  { id: 2, name: 'Monitor', description: 'Tela auxiliar para produtividade' }
];

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/items', (_request, response) => {
  response.json(items);
});

app.get('/items/:id', (request, response) => {
  const item = findItem(request.params.id);

  if (!item) {
    return response.status(404).json({ message: 'Item nao encontrado.' });
  }

  return response.json(item);
});

app.post('/items', (request, response) => {
  const validation = validateItem(request.body);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  const item = {
    id: nextId,
    name: request.body.name.trim(),
    description: request.body.description.trim()
  };

  nextId += 1;
  items.push(item);

  return response.status(201).json(item);
});

app.put('/items/:id', (request, response) => {
  const item = findItem(request.params.id);

  if (!item) {
    return response.status(404).json({ message: 'Item nao encontrado.' });
  }

  const validation = validateItem(request.body);

  if (validation) {
    return response.status(400).json({ message: validation });
  }

  item.name = request.body.name.trim();
  item.description = request.body.description.trim();

  return response.json(item);
});

app.delete('/items/:id', (request, response) => {
  const itemIndex = items.findIndex((item) => item.id === Number(request.params.id));

  if (itemIndex === -1) {
    return response.status(404).json({ message: 'Item nao encontrado.' });
  }

  items.splice(itemIndex, 1);

  return response.status(204).send();
});

function findItem(id) {
  return items.find((item) => item.id === Number(id));
}

function validateItem(body) {
  if (!body?.name?.trim()) {
    return 'Nome e obrigatorio.';
  }

  if (!body?.description?.trim()) {
    return 'Descricao e obrigatoria.';
  }

  return null;
}

export default app;
