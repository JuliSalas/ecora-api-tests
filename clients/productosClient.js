const api = require('./apiClient');

function cabecera(token) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

module.exports = {
  listar: (id) => api.get(`/api/productos/${id}`),
  crear: (cuerpo) => api.post('/api/productos/', cuerpo)
};
