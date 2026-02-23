import { Router } from "express";
import {
 getCatalogos,
  getCatalogosStats,
  getCatalogoById,
  createCatalogo,
  updateCatalogo,
  deleteCatalogo,
} from "../controllers/catalogoController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_generales_catalogo (43 docs)
 *
 * Estructura de cada documento:
 * {
 *   "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD": {
 *     "clave": "1.2.4.1.1",
 *     "descripcion": "Muebles de Oficina y Estantería"
 *   },
 *   "CLASIFICADOR POR OBJETO DE GASTO": {
 *     "codigo": 511,
 *     "descripcion": "Muebles de Oficina y Estantería"
 *   }
 * }
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en clave y descripciones de ambos subdocumentos
 *   ?page=1
 *   ?limit=50
 */

    router.get("/stats", getCatalogosStats);
    router.get("/", getCatalogos);
    router.get("/:id", getCatalogoById);
    router.post("/", createCatalogo);
    router.put("/:id", updateCatalogo);
    router.patch("/:id", updateCatalogo); // usamos el mismo update
    router.delete("/:id", deleteCatalogo);

export default router;
