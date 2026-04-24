import Mueble from "../models/Mueble.js";
import { createCRUDController } from "../utils/crudFactory.js";

// Campos de búsqueda (los tuyos originales)
const SEARCH_FIELDS = [
  "NO. DE RESGUARDO",
  "NO. DE INVENTARIO",
  "CLAVE ARMONIZADA",
  "NOMBRE DEL RESGUARDANTE",
  "UNIDAD ADMINISTRATIVA",
  "UBICACIÓN ACTUAL",
  "DESCRIPCIÓN FÍSICA DEL BIEN",
  "MARCA",
  "MODELO",
  "NO. DE SERIE",
  "FACTURA O DOCUMENTO QUE AMPARA",
  "FECHA DE ADQUISICIÓN ",
  "VALOR DE ADQUISICIÓN",
  "CONDICIÓN FÍSICA DEL BIEN",
];

// 🔥 base
const base = createCRUDController(Mueble, SEARCH_FIELDS);

// ─────────────────────────────────────────────
// CRUD (factory)
export const getAll = base.getAll;
export const getById = base.getById;
export const update = base.update;
export const patch = base.patch;
export const remove = base.remove;

// ─────────────────────────────────────────────
// 🔥 CREATE (mantienes tu fix especial)
export const create = async (req, res) => {
  try {
    console.log("🔥 BODY JUSTO ANTES DE GUARDAR:", req.body);

    const doc = {
      ...req.body,
      estado: "activo",
      historial: [{
        accion: "create",
        por: req.user?.id || "sistema",
        fecha: new Date()
      }]
    };

    const result = await Mueble.collection.insertOne(doc);

    res.status(201).json({
      success: true,
      message: "Mueble creado exitosamente",
      data: result.ops?.[0] || doc
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ─────────────────────────────────────────────
// 🔥 STATS (igual pero filtrando eliminados)
export const getStats = async (req, res) => {
  try {
    const [total, porCondicion, porUnidad] = await Promise.all([
      Mueble.countDocuments({ estado: { $ne: "baja" } }),

      Mueble.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$CONDICIÓN FÍSICA DEL BIEN", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Mueble.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$UNIDAD ADMINISTRATIVA", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
    ]);

    res.json({
      success: true,
      data: {
        total,
        por_condicion: porCondicion,
        top_unidades: porUnidad
      }
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};