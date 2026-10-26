// Casos extra OR-11 a OR-15: permisos y robustez.
// ATENCIÓN: pueden FALLAR por defectos reales de la API. Si fallan, se documenta
// lo esperado contra lo obtenido; NO se cambia la expectativa para que pasen.
const ordenes = require('../clients/ordenesClient');
const { loginAdmin, loginCliente } = require('../helpers/auth');
const datos = require('../data/ordenes.data.json');

let admin;
let cliente;
let ordenAdminId;

beforeAll(async () => {
  admin = await loginAdmin();
  cliente = await loginCliente();
  const res = await ordenes.crear(admin.token, {
    productos: [datos.productoExistente],
    total: datos.totalValido
  });
  expect(res.status).toBe(201);
  ordenAdminId = res.data.orden._id;
});

describe('Permisos', () => {
  test('OR-11 un cliente no debería ver todas las órdenes (403)', async () => {
    const res = await ordenes.listar(cliente.token);
    expect(res.status).toBe(403);
  });

  test('OR-12 un cliente no debería cambiar el estado de una orden ajena (403)', async () => {
    const res = await ordenes.actualizar(cliente.token, ordenAdminId, {
      estado: datos.estadoNuevo
    });
    expect(res.status).toBe(403);
  });
});

describe('Robustez', () => {
  test('OR-13 rechaza actualizar una orden sin estado', async () => {
    const res = await ordenes.actualizar(admin.token, ordenAdminId, {});
    expect(res.status).toBe(400);
    expect(res.data.msj).toBe('El estado es requerido');
  });

  test('OR-16 un estado inválido debería dar 400 (no 500)', async () => {
    const res = await ordenes.actualizar(admin.token, ordenAdminId, {
      estado: datos.estadoInvalido
    });
    expect(res.status).toBe(400);
  });

  test('OR-14 un id mal formado debería dar 400 o 404 (no 500)', async () => {
    const res = await ordenes.actualizar(admin.token, datos.idMalFormado, {
      estado: datos.estadoNuevo
    });
    expect([400, 404]).toContain(res.status);
  });

  test('OR-15 un id de producto mal formado debería dar 400 (no 500)', async () => {
    const res = await ordenes.crear(admin.token, {
      productos: [datos.idMalFormado],
      total: datos.totalValido
    });
    expect(res.status).toBe(400);
  });
});
