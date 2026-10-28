// Casos PR-06 a PR-10: Categorias (responsable: Diego)
const categorias = require('../clients/categoriasClient');
const datos = require('../data/categorias.data.json');

describe('GET /api/categorias', () => {

  // Test 1: GET /api/categorias para obtener todas
  test('GET /api/categorias debería retornar una lista completa de categorías', async () => {
    const response = await categorias.listar();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });

  // Test 2: GET /api/categorias/:id debería retornar una categoría específica
  test('GET /api/categorias/:id debería retornar correctamente una categoría existente', async () => {
    const response = await categorias.listarEspecifico(datos.categoriaExistente);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('_id', datos.categoriaExistente);
    expect(response.data).toHaveProperty('genero');
    expect(response.data).toHaveProperty('tipo');
  });

  // Test 3: POST /api/categorias debería crear una categoría nueva
  test('POST /api/categorias debería crear una categoría nueva única', async () => {
    const uniqueTipo = `Gadgets-prueba-${Date.now()}`;
    const payload = {
      genero: "Hombre",
      tipo: uniqueTipo
    };

    const response = await categorias.crear(payload);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('msj', 'Categoria registrada correctamente');
    expect(response.data.categoria.tipo).toBe(uniqueTipo);
  });

  // Test 4: POST /api/categorias validación de género
  test('POST /api/categorias debería fallar si el género no existe', async () => {
    const payload = {
      genero: "Indefinido",
      tipo: `TestType-${Date.now()}`
    };

    const response = await categorias.crear(payload);

    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('msj', 'El genero de la categoria debe ser hombre o mujer');
  });

  // Test 5: GET /api/categorias/:id con una id no existente
  test('GET /api/categorias/:id debería retornar 404 por una id no existente', async () => {
    const response = await categorias.listarEspecifico(datos.categoriaInexistente);

    expect(response.status).toBe(404);
    expect(response.data).toHaveProperty('msj', 'Categoria no encontrada');
  });

});