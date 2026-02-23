import { Router } from "express";
import {
  getAll,
  getStats,
  getById,
  create,
  update,
  patch,
  remove,
} from "../controllers/balisticoController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_generales_equipo_balistico (8 docs)
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en TODOS los campos string
 *   ?resguardante=     → Nombre del resguardante
 *   ?page=1
 *   ?limit=50
 */

router.get("/stats",  getStats);   // GET  /api/balistico/stats
router.get("/",       getAll);     // GET  /api/balistico
router.get("/:id",    getById);    // GET  /api/balistico/:id
router.post("/",      create);     // POST /api/balistico
router.put("/:id",    update);     // PUT  /api/balistico/:id
router.patch("/:id",  patch);      // PATCH /api/balistico/:id
router.delete("/:id", remove);     // DELETE /api/balistico/:id

export default router;
