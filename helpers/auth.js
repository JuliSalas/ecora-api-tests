const api = require('../clients/apiClient');
const { admin, cliente } = require('../config/config');

async function login(credenciales, rol) {
  if (!credenciales.correo || !credenciales.contrasenna) {
    throw new Error(`Faltan las credenciales de ${rol} en el archivo .env`);
  }
  const res = await api.post('/api/usuarios/iniciar-sesion', credenciales);
  if (res.status !== 200 || !res.data.token) {
    throw new Error(`No se pudo iniciar sesión como ${rol} (status ${res.status})`);
  }
  return { token: res.data.token, usuario: res.data.usuario };
}

module.exports = {
  loginAdmin: () => login(admin, 'administrador'),
  loginCliente: () => login(cliente, 'cliente')
};
