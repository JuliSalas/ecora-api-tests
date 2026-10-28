const { randomUUID } = require('crypto');

function crearUsuario() {
    return {
        nombre: 'Carlos Prueba',
        correo: `carlos.pruebas.${randomUUID()}@example.com`,
        contrasenna: 'EcoraPrueba2026!',
        tipoUsuario: 'cliente'
    };
}

module.exports = {
    crearUsuario,
    correoInexistente: `no.existe.${randomUUID()}@example.com`,
    contrasennaIncorrecta: 'Incorrecta2026!',
    tipoUsuarioInvalido: 'supervisor',
    nombreActualizado: 'Carlos Prueba Actualizado'
};