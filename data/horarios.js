/* ---------- DATOS INICIALES ---------- */

/*
  estructura:
    horarios = { "GRUPO": { "YYYY-MM-DD": [ {hora, evento, lugar}, ... ] } }
*/
const horarios = {
  "1A": {
    "2025-09-23": [
      { hora: "07:00 - 08:00", evento: "Matemáticas", lugar: "Salón 3" },
      { hora: "08:00 - 09:00", evento: "Español", lugar: "Salón 7" }
    ]
  },
  "1B": {
    "2025-09-23": [
      { hora: "07:00 - 08:00", evento: "Ciencias Naturales", lugar: "Laboratorio 1" },
      { hora: "08:00 - 09:00", evento: "Educación Física", lugar: "Cancha" }
    ]
  },
  "2A": {
    "2025-09-23": [
      { hora: "09:00 - 10:00", evento: "Historia", lugar: "Salón 2" },
      { hora: "10:00 - 11:00", evento: "Inglés", lugar: "Salón 5" }
    ]
  }
};

/* Actividades globales obligatorias (las 3 charlas) */
const actividadesGlobales = [
  { id: "charla1", nombre: "Charla 1 del orientador" },
  { id: "charla2", nombre: "Charla 2 del orientador" },
  { id: "charla3", nombre: "Charla 3 del orientador" }
];

/* Registro de charlas impartidas por grupo:
   charlasImpartidas = { "1A": [ { id, nombre, fecha, hora, lugar, evento } ] }
   Inicialmente vacío.
*/
const charlasImpartidas = {};
Object.keys(horarios).forEach(g => { charlasImpartidas[g] = []; });
