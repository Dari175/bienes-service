import { Router } from "express";
import {
  getAll,
  getStats,
  getById,
  create,
  update,
  patch,
  remove,
} from "../controllers/controlController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_control (841 docs)
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en TODOS los campos string
 *   ?unidad=           → UNIDAD ADMINISTRATIVA  (PRESIDENCIA MUNICIPAL, etc.)
 *   ?condicion=        → CONDICIÓN FÍSICA DEL BIEN  (BUENO | REGULAR | MALO)
 *   ?resguardante=     → NOMBRE DEL RESGUARDANTE
 *   ?page=1
 *   ?limit=50
 *
 * NOTA: NO. RESGUARDO y NO. DE INVENTARIO son strings (ej. "1 ATTO"), no numéricos.
 */

router.get("/stats",  getStats);   // GET  /api/control/stats
router.get("/",       getAll);     // GET  /api/control
router.get("/:id",    getById);    // GET  /api/control/:id
router.post("/",      create);     // POST /api/control
router.put("/:id",    update);     // PUT  /api/control/:id
router.patch("/:id",  patch);      // PATCH /api/control/:id
router.delete("/:id", remove);     // DELETE /api/control/:id

export default router;
