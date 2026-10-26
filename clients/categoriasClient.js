const api = require('./apiClient');

module.exports = {
  listar: () => api.get('/api/categorias'),
  crear: (cuerpo) => api.post('/api/categorias', cuerpo),
};
