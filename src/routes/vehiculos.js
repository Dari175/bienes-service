import { Router } from "express";
import {
  getAll,
  getStats,
  getById,
  create,
  update,
  patch,
  remove,
} from "../controllers/vehiculoController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_generales_parque_vehicular (126 docs)
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en TODOS los campos string
 *   ?marca=            → Marca  (NISSAN, VOLKSWAGEN, FORD, etc.)
 *   ?tipo=             → Tipo  (ESTACAS, JETTA, PICK UP, etc.)
 *   ?estado=           → Estado fisico del vehículo  (BUENO | REGULAR | MALO)
 *   ?resguardante=     → Nombre del Resguardante
 *   ?propiedad=        → Propiedad del Ayuntamiento / Comodato  (dependencia)
 *   ?page=1
 *   ?limit=50
 */

router.get("/stats",  getStats);   // GET  /api/vehiculos/stats
router.get("/",       getAll);     // GET  /api/vehiculos
router.get("/:id",    getById);    // GET  /api/vehiculos/:id
router.post("/",      create);     // POST /api/vehiculos
router.put("/:id",    update);     // PUT  /api/vehiculos/:id
router.patch("/:id",  patch);      // PATCH /api/vehiculos/:id
router.delete("/:id", remove);     // DELETE /api/vehiculos/:id

export default router;
