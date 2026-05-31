import { useEffect, useMemo, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const emptyForm = { name: '', description: '' };

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/items`);
      const data = await response.json();
      setItems(data);
      setError('');
    } catch {
      setError('Nao foi possivel carregar os itens.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const endpoint = isEditing ? `${apiUrl}/items/${editingId}` : `${apiUrl}/items`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message);
      }

      await loadItems();
      resetForm();
    } catch (currentError) {
      setError(currentError.message || 'Nao foi possivel salvar o item.');
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`${apiUrl}/items/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Nao foi possivel remover o item.');
      }

      await loadItems();

      if (editingId === id) {
        resetForm();
      }
    } catch (currentError) {
      setError(currentError.message);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description });
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="panel form-panel">
          <p className="eyebrow">CRUD</p>
          <h1>Itens do inventario</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ex: Teclado"
            />

            <label htmlFor="description">Descricao</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Ex: Teclado mecanico USB"
              rows="4"
            />

            {error ? <p className="error">{error}</p> : null}

            <div className="actions">
              <button type="submit">{isEditing ? 'Atualizar' : 'Criar'}</button>
              {isEditing ? (
                <button type="button" className="secondary" onClick={resetForm}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="panel list-panel">
          <div className="list-header">
            <h2>Itens cadastrados</h2>
            <span>{items.length}</span>
          </div>

          {isLoading ? <p className="muted">Carregando...</p> : null}

          {!isLoading && items.length === 0 ? <p className="muted">Nenhum item cadastrado.</p> : null}

          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <div className="row-actions">
                  <button type="button" className="secondary" onClick={() => handleEdit(item)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(item.id)}>
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default App;
