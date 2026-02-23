import { Router } from "express";
import {
  getAll,
  getStats,
  getById,
  create,
  update,
  patch,
  remove,
} from "../controllers/inmuebleController.js";

const router = Router();

/**
 * COLECCIÓN: bienes_generales_inmuebles (51 docs)
 *
 * Campos disponibles para filtrar:
 *   ?q=texto           → búsqueda en TODOS los campos string
 *   ?uso=              → Uso o destino  (PLANTEL EDUCATIVO, LOTE, etc.)
 *   ?forma=            → Forma de adquisición  (DONACIÓN, COMPRA, etc.)
 *   ?situacion=        → Situación legal del bien inmueble  (EN REGLA, etc.)
 *   ?responsable=      → Responsable de la guardia y custodia...
 *   ?page=1
 *   ?limit=50
 *
 * NOTA: "Fecha de adquisición /movimiento" viene como timestamp en milisegundos.
 *       Convertir: new Date(1113782400000) → 2005-04-18
 */

router.get("/stats",  getStats);   // GET  /api/inmuebles/stats
router.get("/",       getAll);     // GET  /api/inmuebles
router.get("/:id",    getById);    // GET  /api/inmuebles/:id
router.post("/",      create);     // POST /api/inmuebles
router.put("/:id",    update);     // PUT  /api/inmuebles/:id
router.patch("/:id",  patch);      // PATCH /api/inmuebles/:id
router.delete("/:id", remove);     // DELETE /api/inmuebles/:id

export default router;
