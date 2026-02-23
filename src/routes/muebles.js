import { Router } from "express";
import {
  getAll,
  getStats,
  getById,
  create,
  update,
  patch,
  remove,
} from "../controllers/muebleController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_generales_muebles (2,230 docs)
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en TODOS los campos string
 *   ?unidad=           → UNIDAD ADMINISTRATIVA
 *   ?condicion=        → CONDICIÓN FÍSICA DEL BIEN  (BUENO | REGULAR | MALO)
 *   ?resguardante=     → NOMBRE DEL RESGUARDANTE
 *   ?page=1            → paginación
 *   ?limit=50          → docs por página (máx 200)
 */

router.get("/stats",  getStats);   // GET  /api/muebles/stats
router.get("/",       getAll);     // GET  /api/muebles
router.get("/:id",    getById);    // GET  /api/muebles/:id
router.post("/",      create);     // POST /api/muebles
router.put("/:id",    update);     // PUT  /api/muebles/:id   (reemplazo completo)
router.patch("/:id",  patch);      // PATCH /api/muebles/:id  (actualización parcial)
router.delete("/:id", remove);     // DELETE /api/muebles/:id

export default router;
