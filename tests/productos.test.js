// Casos PR-01 a PR-05: Productos (responsable: Diego)
const productos = require('../clients/productosClient');
const datos = require('../data/productos.data.json');

describe('GET /api/productos', () => {

  // Test 1: GET de un producto específico
  test('GET /productos/:id debería traer un producto existente específico', async () => {
    const response = await productos.listar(datos.productoExistente);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('_id', datos.productoExistente);
    expect(response.data).toHaveProperty('nombre');
  });

  // Test 2: POST publicar un producto válido
  test('POST /productos debería crear un producto válido', async () => {
    const nombreUnico = `Producto Prueba ${Date.now()}`;

    const payload = {
      nombre: nombreUnico,
      categorias: [
        { genero: "Hombre", tipo: "Accesorios" }
      ],
      tallas: [datos.tallaValida],
      descripcion: "Producto de prueba",
      precio: datos.precioBienFormado,
      imagen: "https://res.cloudinary.com/vxvds9f5/image/upload/sample.jpg"
    };

    const response = await productos.crear(payload);

    expect(response.status).toBe(201);
    expect(response.data.producto.nombre).toBe(nombreUnico);
  });

  // Test 3: POST fallo usando una categoría no existente
  test('POST /productos debería fallar con un 400/422 al usar una categoría no existente', async () => {
    const payload = {
      nombre: `Invalid Cat Item ${Date.now()}`,
      categorias: [datos.categoriaInexistente],
      tallas: [datos.tallaValida],
      descripcion: "Should fail validation",
      precio: datos.precioBienFormado
    };

    const response = await productos.crear(payload);
    expect([400, 422]).toContain(response.status);
  });

  // Test 4: GET/PUT con una id mal formada (e.g., "abc")
  test('GET /productos/:id debería retornar 400 Bad Request por una id mal formada', async () => {
    const response = await productos.listar(datos.idMalFormado);
    expect(response.status).toBe(400);
  });

  // Test 5: GET/PUT con una id no existente
  test('GET /productos/:id debería retornar 404 Not Found por una id de producto no existente', async () => {
    const response = await productos.listar(datos.productoInexistente);
    expect(response.status).toBe(404);
  });
});