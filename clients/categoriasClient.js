const api = require('./apiClient');

module.exports = {
  listar: () => api.get('/api/categorias/'),
  listarEspecifico: (id) => api.get(`/api/categorias/${id}`),
  crear: (cuerpo) => api.post('/api/categorias', cuerpo),
};
