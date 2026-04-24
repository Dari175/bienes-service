import Control from "../models/Control.js";
import { createCRUDController } from "../utils/crudFactory.js";

// Campos de búsqueda (los tuyos originales)
const SEARCH_FIELDS = [
  "NO. RESGUARDO",
  "NO. DE INVENTARIO",
  "CLAVE ARMONIZADA",
  "NOMBRE DEL RESGUARDANTE",
  "UNIDAD ADMINISTRATIVA",
  "UBICACIÓN ACTUAL",
  "UNIDAD",
  "DESCRIPCIÓN",
  "MARCA",
  "MODELO",
  "NÚMERO DE SERIE",
  "FACTURA O DOCUMENTO QUE AMPARA",
  "FECHA DE ADQUISICIÓN",
  "VALOR DE ADQUISICIÓN",
  "CONDICIÓN FÍSICA DEL BIEN",
  "OBSERVACIÓNES",
];

// 🔥 base del factory
const base = createCRUDController(Control, SEARCH_FIELDS);

// ─────────────────────────────────────────────
// CRUD (automático con soft delete)
export const getAll = base.getAll;
export const getById = base.getById;
export const create = base.create;
export const update = base.update;
export const patch = base.patch;
export const remove = base.remove;

// ─────────────────────────────────────────────
// 🔥 STATS (personalizado, lo conservas)
export const getStats = async (req, res) => {
  try {
    const [total, porCondicion, porUnidad] = await Promise.all([
      // 🔥 solo activos
      Control.countDocuments({ estado: { $ne: "baja" } }),

      Control.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        {
          $group: {
            _id: "$CONDICIÓN FÍSICA DEL BIEN",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      Control.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        {
          $group: {
            _id: "$UNIDAD ADMINISTRATIVA",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
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
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};