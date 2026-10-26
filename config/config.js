require('dotenv').config();

module.exports = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  admin: {
    correo: process.env.ADMIN_CORREO,
    contrasenna: process.env.ADMIN_CONTRASENNA
  },
  cliente: {
    correo: process.env.CLIENTE_CORREO,
    contrasenna: process.env.CLIENTE_CONTRASENNA
  }
};
