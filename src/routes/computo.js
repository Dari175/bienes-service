import { Router } from "express";
import {
  getAll,
  getStats,
  getById,
  create,
  update,
  patch,
  remove,
} from "../controllers/computoController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_generales_computo (568 docs)
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en TODOS los campos string
 *   ?marca=            → MARCA  (DELL, PANASONIC, HP, etc.)
 *   ?unidad=           → UNIDAD ADMINISTRATIVA
 *   ?condicion=        → CONDICIÓN FÍSICA DEL BIEN  (BUENO | REGULAR | MALO)
 *   ?resguardante=     → NOMBRE DEL RESGUARDANTE
 *   ?page=1
 *   ?limit=50
 */

router.get("/stats",  getStats);   // GET  /api/computo/stats
router.get("/",       getAll);     // GET  /api/computo
router.get("/:id",    getById);    // GET  /api/computo/:id
router.post("/",      create);     // POST /api/computo
router.put("/:id",    update);     // PUT  /api/computo/:id
router.patch("/:id",  patch);      // PATCH /api/computo/:id
router.delete("/:id", remove);     // DELETE /api/computo/:id

export default router;
