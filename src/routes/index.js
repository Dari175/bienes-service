import { Router } from "express";
import mueblesRouter   from "./muebles.js";
import computoRouter   from "./computo.js";
import balisticoRouter from "./balistico.js";
import inmueblesRouter from "./inmuebles.js";
import vehiculosRouter from "./vehiculos.js";
import controlRouter   from "./control.js";
import catalogoRouter  from "./catalogo.js";
import { getGlobalStats, globalSearch } from "../controllers/index.js";

const router = Router();

/**
 * ── Rutas globales ──────────────────────────────────────────────────────────
 *
 * GET /api/stats         → conteo de documentos en TODAS las colecciones
 * GET /api/search?q=     → búsqueda simultánea en todas las colecciones (10 c/u)
 *
 * ── Rutas por colección ─────────────────────────────────────────────────────
 *
 * /api/muebles           → bienes_generales_muebles     (2,230 docs)
 * /api/computo           → bienes_generales_computo      (568 docs)
 * /api/balistico         → bienes_generales_equipo_balistico (8 docs)
 * /api/inmuebles         → bienes_generales_inmuebles    (51 docs)
 * /api/vehiculos         → bienes_generales_parque_vehicular (126 docs)
 * /api/control           → bienes_control                (841 docs)
 * /api/catalogo          → bienes_generales_catalogo     (43 docs)
 */

router.get("/stats",  getGlobalStats);
router.get("/search", globalSearch);

router.use("/muebles",   mueblesRouter);
router.use("/computo",   computoRouter);
router.use("/balistico", balisticoRouter);
router.use("/inmuebles", inmueblesRouter);
router.use("/vehiculos", vehiculosRouter);
router.use("/control",   controlRouter);
router.use("/catalogo",  catalogoRouter);

export default router;
