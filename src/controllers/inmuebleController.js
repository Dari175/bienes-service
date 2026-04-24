import Inmueble from "../models/Inmueble.js";
import { createCRUDController } from "../utils/crudFactory.js";

// Campos de búsqueda (los tuyos originales)
const SEARCH_FIELDS = [
  "Número de inventario",
  "Clave Armonizada",
  "Descripción del bien inmueble",
  "Número del documento que ampara la propiedad del bien",
  "Documento que ampara la propiedad del bien",
  "Responsable de la guardia y custodia del documento que ampara la propiedad",
  "Situación legal del bien inmueble",
  "Ubicación",
  "Uso o destino",
  "Forma de adquisición",
  "Observaciones",
];

// 🔥 base factory
const base = createCRUDController(Inmueble, SEARCH_FIELDS);

// ─────────────────────────────────────────────
// CRUD (automático)
export const getAll = base.getAll;
export const getById = base.getById;
export const create = base.create;
export const update = base.update;
export const patch = base.patch;
export const remove = base.remove;

// ─────────────────────────────────────────────
// 🔥 STATS (filtrando eliminados)
export const getStats = async (req, res) => {
  try {
    const [total, porUso, porForma, porSituacion] = await Promise.all([
      Inmueble.countDocuments({ estado: { $ne: "baja" } }),

      Inmueble.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Uso o destino", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Inmueble.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Forma de adquisición", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Inmueble.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Situación legal del bien inmueble", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total,
        por_uso: porUso,
        por_forma_adquisicion: porForma,
        por_situacion_legal: porSituacion
      }
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};