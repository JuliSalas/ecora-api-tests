const api = require('./apiClient');

function cabecera(token) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

module.exports = {
  listar: (token) => api.get('/api/ordenes', cabecera(token)),
  misCompras: (token) => api.get('/api/ordenes/mis-compras', cabecera(token)),
  crear: (token, cuerpo) => api.post('/api/ordenes', cuerpo, cabecera(token)),
  actualizar: (token, id, cuerpo) => api.put(`/api/ordenes/${id}`, cuerpo, cabecera(token))
};
