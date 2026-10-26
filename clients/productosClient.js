const api = require('./apiClient');

function cabecera(token) {
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

module.exports = {
  listar: (id) => api.get(`/api/productos/${id}`),
  crear: (cuerpo) => api.post('/api/productos/', cuerpo),
  actualizar: (token, id, cuerpo) => api.put(`/api/productos/${id}`, cuerpo, cabecera(token)),
  eliminar: (token, id, cuerpo) => api.delete(`/api/productos/${id}`, cuerpo, cabecera(token))
};
