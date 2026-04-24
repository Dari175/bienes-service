import Computo from "../models/Computo.js";
import { createCRUDController } from "../utils/crudFactory.js";

// Campos de búsqueda (ajústalos si tu modelo tiene ligeras variaciones)
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
  "FECHA DE ADQUISICIÓN",
  "VALOR DE ADQUISICIÓN",
  "CONDICIÓN FÍSICA DEL BIEN",
];

// 🔥 base factory
const base = createCRUDController(Computo, SEARCH_FIELDS);

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
    const [total, porCondicion, porUnidad] = await Promise.all([
      Computo.countDocuments({ estado: { $ne: "baja" } }),

      Computo.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        {
          $group: {
            _id: "$CONDICIÓN FÍSICA DEL BIEN",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      Computo.aggregate([
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