import Mueble    from "../models/Mueble.js";
import Computo   from "../models/Computo.js";
import Balistico from "../models/Balistico.js";
import Inmueble  from "../models/Inmueble.js";
import Vehiculo  from "../models/Vehiculo.js";
import Control   from "../models/Control.js";
import Catalogo  from "../models/Catalogo.js";

// Re-exportar controladores individuales
export * as muebleCtrl    from "./muebleController.js";
export * as computoCtrl   from "./computoController.js";
export * as balisticoCtrl from "./balisticoController.js";
export * as inmuebleCtrl  from "./inmuebleController.js";
export * as vehiculoCtrl  from "./vehiculoController.js";
export * as controlCtrl   from "./controlController.js";
export * as catalogoCtrl  from "./catalogoController.js";

// ─── Stats globales ──────────────────────────────────────────────────────────
export const getGlobalStats = async (req, res) => {
  try {
    const [muebles, computo, balistico, inmuebles, vehiculos, control, catalogo] =
      await Promise.all([
        Mueble.countDocuments(),
        Computo.countDocuments(),
        Balistico.countDocuments(),
        Inmueble.countDocuments(),
        Vehiculo.countDocuments(),
        Control.countDocuments(),
        Catalogo.countDocuments(),
      ]);

    res.json({
      success: true,
      data: {
        total: muebles + computo + balistico + inmuebles + vehiculos + control,
        colecciones: {
          bienes_generales_muebles: muebles,
          bienes_generales_computo: computo,
          bienes_generales_equipo_balistico: balistico,
          bienes_generales_inmuebles: inmuebles,
          bienes_generales_parque_vehicular: vehiculos,
          bienes_control: control,
          bienes_generales_catalogo: catalogo,
        },
      },
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ─── Búsqueda global ─────────────────────────────────────────────────────────
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Parámetro 'q' requerido" });

    const r = new RegExp(q, "i");

    const [muebles, computo, balistico, inmuebles, vehiculos, control] = await Promise.all([
      Mueble.find({ $or: [{ "NOMBRE DEL RESGUARDANTE": r }, { "DESCRIPCIÓN FÍSICA DEL BIEN": r }, { "UNIDAD ADMINISTRATIVA": r }, { "MARCA": r }] }).limit(10).lean(),
      Computo.find({ $or: [{ "NOMBRE DEL RESGUARDANTE": r }, { "DESCRIPCIÓN FÍSICA DEL BIEN": r }, { "MARCA": r }, { "MODELO": r }] }).limit(10).lean(),
      Balistico.find({ $or: [{ "Nombre del resguardante": r }, { "Descripción": r }] }).limit(10).lean(),
      Inmueble.find({ $or: [{ "Descripción del bien inmueble": r }, { "Ubicación": r }, { "Número de inventario": r }] }).limit(10).lean(),
      Vehiculo.find({ $or: [{ "Nombre del Resguardante": r }, { "Marca": r }, { "Placas": r }, { "Serie": r }] }).limit(10).lean(),
      Control.find({ $or: [{ "NOMBRE DEL RESGUARDANTE": r }, { "DESCRIPCIÓN": r }, { "UNIDAD ADMINISTRATIVA": r }] }).limit(10).lean(),
    ]);

    res.json({
      success: true,
      query: q,
      data: { muebles, computo, balistico, inmuebles, vehiculos, control },
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
