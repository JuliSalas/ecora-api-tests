const api = require('./apiClient');

function cabecera(token) {
    return token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
}

module.exports = {
    iniciarSesion: (datos) =>
        api.post('/api/usuarios/iniciar-sesion', datos),

    registrar: (datos) =>
        api.post('/api/usuarios', datos),

    buscarPorCorreo: (token, correo) =>
        api.get(
            `/api/usuarios/buscar/${encodeURIComponent(correo)}`,
            cabecera(token)
        ),

    actualizar: (token, id, datos) =>
        api.put(`/api/usuarios/${id}`, datos, cabecera(token))
};