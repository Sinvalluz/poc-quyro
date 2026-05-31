import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  it('renders items from the api', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, name: 'Notebook', description: 'Equipamento' }]
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Notebook')).toBeInTheDocument();
    });
  });
});
