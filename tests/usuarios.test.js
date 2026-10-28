const usuarios = require('../clients/usuariosClient');
const datos = require('../data/usuarios.data');

let usuarioBase;
let usuarioId;
let token;

// Preparación común: crear un cliente e iniciar sesión.
// Estos pasos preparan los datos; no cuentan como casos adicionales.
beforeAll(async () => {
    usuarioBase = datos.crearUsuario();

    const registro = await usuarios.registrar(usuarioBase);

    expect(registro.status).toBe(201);
    expect(registro.data.usuario._id).toEqual(expect.any(String));

    usuarioId = registro.data.usuario._id;

    const sesion = await usuarios.iniciarSesion({
        correo: usuarioBase.correo,
        contrasenna: usuarioBase.contrasenna
    });

    expect(sesion.status).toBe(200);
    expect(sesion.data.token).toEqual(expect.any(String));
    expect(sesion.data.token.length).toBeGreaterThan(0);

    token = sesion.data.token;
});

describe('Inicio de sesión de usuarios', () => {
    test('US-01 inicia sesión con credenciales correctas', async () => {
        const res = await usuarios.iniciarSesion({
            correo: usuarioBase.correo,
            contrasenna: usuarioBase.contrasenna
        });

        expect(res.status).toBe(200);
        expect(res.data.msg).toBe('Inicio de sesión correcto.');
        expect(res.data.token).toEqual(expect.any(String));
        expect(res.data.token.length).toBeGreaterThan(0);

        expect(res.data.usuario).toMatchObject({
            id: usuarioId,
            correo: usuarioBase.correo,
            rol: 'cliente'
        });

        expect(res.data.usuario).not.toHaveProperty('contrasenna');
    });

    test('US-02 rechaza una contraseña incorrecta', async () => {
        const res = await usuarios.iniciarSesion({
            correo: usuarioBase.correo,
            contrasenna: datos.contrasennaIncorrecta
        });

        expect(res.status).toBe(401);
        expect(res.data.msg).toBe('Credenciales inválidas.');
        expect(res.data).not.toHaveProperty('token');
    });

    test('US-03 rechaza un correo no registrado', async () => {
        const res = await usuarios.iniciarSesion({
            correo: datos.correoInexistente,
            contrasenna: usuarioBase.contrasenna
        });

        expect(res.status).toBe(401);
        expect(res.data.msj).toBe('Credenciales inválidas.');
        expect(res.data).not.toHaveProperty('token');
    });
});

describe('Registro de usuarios', () => {
    test('US-04 registra un cliente con datos válidos', async () => {
        const nuevoUsuario = datos.crearUsuario();

        const res = await usuarios.registrar(nuevoUsuario);

        expect(res.status).toBe(201);
        expect(res.data.msj).toBe('Usuario registrado correctamente');

        expect(res.data.usuario).toMatchObject({
            nombre: nuevoUsuario.nombre,
            correo: nuevoUsuario.correo,
            tipoUsuario: 'cliente'
        });

        expect(res.data.usuario._id).toEqual(expect.any(String));

        // Verificar que la cuenta creada permite iniciar sesión.
        const sesion = await usuarios.iniciarSesion({
            correo: nuevoUsuario.correo,
            contrasenna: nuevoUsuario.contrasenna
        });

        expect(sesion.status).toBe(200);
        expect(sesion.data.usuario.id).toBe(res.data.usuario._id);
        expect(sesion.data.token).toEqual(expect.any(String));
        expect(sesion.data.token.length).toBeGreaterThan(0);
    });

    test('US-05 rechaza un correo ya registrado', async () => {
        const res = await usuarios.registrar({
            ...datos.crearUsuario(),
            correo: usuarioBase.correo
        });

        expect(res.status).toBe(409);
        expect(res.data.msj).toBe(
            'Ya existe un usuario registrado con ese correo'
        );
    });

    test('US-06 rechaza un registro sin nombre', async () => {
        const usuarioSinNombre = datos.crearUsuario();
        delete usuarioSinNombre.nombre;

        const res = await usuarios.registrar(usuarioSinNombre);

        expect(res.status).toBe(400);
        expect(res.data.msj).toBe(
            'Nombre, correo y contraseña son requeridos'
        );
    });

    test('US-07 rechaza un tipo de usuario inválido', async () => {
        const res = await usuarios.registrar({
            ...datos.crearUsuario(),
            tipoUsuario: datos.tipoUsuarioInvalido
        });

        expect(res.status).toBe(400);
        expect(res.data.msj).toBe(
            'El tipo de usuario debe ser admin o cliente'
        );
    });
});

describe('Búsqueda de usuarios', () => {
    test('US-08 busca un usuario con token válido', async () => {
        const res = await usuarios.buscarPorCorreo(
            token,
            usuarioBase.correo
        );

        expect(res.status).toBe(200);
        expect(res.data).toMatchObject({
            _id: usuarioId,
            correo: usuarioBase.correo,
            tipoUsuario: 'cliente'
        });
    });

    test('US-09 rechaza una búsqueda sin token', async () => {
        const res = await usuarios.buscarPorCorreo(
            undefined,
            usuarioBase.correo
        );

        expect(res.status).toBe(401);
        expect(res.data.msg).toBe('El token es requerido.');
    });
});

describe('Actualización de usuarios', () => {
    test('US-10 actualiza el nombre del usuario de prueba', async () => {
        const res = await usuarios.actualizar(token, usuarioId, {
            nombre: datos.nombreActualizado
        });

        expect(res.status).toBe(200);
        expect(res.data.msj).toBe('Usuario actualizado correctamente');

        expect(res.data.usuario).toMatchObject({
            _id: usuarioId,
            nombre: datos.nombreActualizado,
            correo: usuarioBase.correo,
            tipoUsuario: 'cliente'
        });

        // Consultar de nuevo para verificar que el cambio quedó guardado.
        const consulta = await usuarios.buscarPorCorreo(
            token,
            usuarioBase.correo
        );

        expect(consulta.status).toBe(200);
        expect(consulta.data._id).toBe(usuarioId);
        expect(consulta.data.nombre).toBe(datos.nombreActualizado);
    });
});