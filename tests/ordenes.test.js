// Casos OR-01 a OR-10: órdenes y permisos (responsable: Julián)
const ordenes = require('../clients/ordenesClient');
const { loginAdmin, loginCliente } = require('../helpers/auth');
const datos = require('../data/ordenes.data.json');

let admin;
let cliente;

beforeAll(async () => {
  admin = await loginAdmin();
  cliente = await loginCliente();
});

describe('GET /api/ordenes', () => {
  test('OR-01 rechaza consultar órdenes sin token', async () => {
    const res = await ordenes.listar();
    expect(res.status).toBe(401);
    expect(res.data.msg).toContain('El token es requerido');
  });

  test('OR-02 lista las órdenes con token válido', async () => {
    const res = await ordenes.listar(admin.token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    if (res.data.length > 0) {
      expect(res.data[0]).toHaveProperty('_id');
      expect(res.data[0]).toHaveProperty('estado');
      expect(res.data[0]).toHaveProperty('total');
    }
  });

  test('OR-03 rechaza un token inválido', async () => {
    const res = await ordenes.listar(datos.tokenInvalido);
    expect(res.status).toBe(401);
    expect(res.data.msg).toContain('Token inválido o vencido');
  });
});

describe('GET /api/ordenes/mis-compras', () => {
  beforeAll(async () => {
    // El cliente crea una orden para que "mis compras" no esté vacío
    const res = await ordenes.crear(cliente.token, {
      productos: [datos.productoExistente],
      total: datos.totalValido
    });
    expect(res.status).toBe(201);
  });

  test('OR-04 devuelve solo las compras del usuario autenticado', async () => {
    const res = await ordenes.misCompras(cliente.token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    res.data.forEach((orden) => {
      expect(String(orden.clienteAsociado[0].cliente._id)).toBe(String(cliente.usuario.id));
    });
  });

  test('OR-05 rechaza consultar mis compras sin token', async () => {
    const res = await ordenes.misCompras();
    expect(res.status).toBe(401);
    expect(res.data.msg).toContain('El token es requerido');
  });
});

describe('POST /api/ordenes', () => {
  test('OR-06 crea una orden válida', async () => {
    const res = await ordenes.crear(admin.token, {
      productos: [datos.productoExistente],
      total: datos.totalValido
    });
    expect(res.status).toBe(201);
    expect(res.data.msj).toBe('Orden creada correctamente');
    expect(res.data.orden.estado).toBe('Pendiente');
    expect(String(res.data.orden.total)).toBe(String(datos.totalValido));
    expect(res.data.orden.productosOrden).toHaveLength(1);
  });

  test('OR-07 rechaza una orden sin productos', async () => {
    const res = await ordenes.crear(admin.token, {
      productos: [],
      total: datos.totalValido
    });
    expect(res.status).toBe(400);
    expect(res.data.msj).toBe('Productos y total son requeridos');
  });

  test('OR-08 rechaza una orden con un producto inexistente', async () => {
    const res = await ordenes.crear(admin.token, {
      productos: [datos.productoInexistente],
      total: datos.totalValido
    });
    expect(res.status).toBe(400);
    expect(res.data.msj).toContain('no existen');
  });
});

describe('PUT /api/ordenes/:id', () => {
  let ordenId;

  beforeAll(async () => {
    // Se crea una orden propia para no modificar las de otros integrantes
    const res = await ordenes.crear(admin.token, {
      productos: [datos.productoExistente],
      total: datos.totalValido
    });
    expect(res.status).toBe(201);
    ordenId = res.data.orden._id;
  });

  test('OR-09 actualiza el estado de una orden', async () => {
    const res = await ordenes.actualizar(admin.token, ordenId, { estado: datos.estadoNuevo });
    expect(res.status).toBe(200);
    expect(res.data.msj).toBe('Estado de la orden actualizado correctamente');
    expect(res.data.orden.estado).toBe(datos.estadoNuevo);
  });

  test('OR-10 rechaza actualizar una orden que no existe', async () => {
    const res = await ordenes.actualizar(admin.token, datos.ordenInexistente, {
      estado: datos.estadoNuevo
    });
    expect(res.status).toBe(404);
    expect(res.data.msj).toBe('Orden no encontrada');
  });
});
