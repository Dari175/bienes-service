import Vehiculo from "../models/Vehiculo.js";
import { createCRUDController } from "../utils/crudFactory.js";

// Campos de búsqueda (los tuyos originales)
const SEARCH_FIELDS = [
  "CLAVE ", // tiene espacio al final
  "Marca",
  "Tipo",
  "Color",
  "Placas",
  "MatrÍcula",
  "Serie",
  "No. de Motor",
  "Tarjeta de circulación",
  "Verificación",
  "Tenencia",
  "Estado fisico del vehículo",
  "No. De Factura",
  "Valor Factura",
  "Precio en libros",
  "Nombre del Resguardante",
  "Propiedad del Ayuntamiento / Comodato",
  "Ubicación",
  "Observaciones",
];

// 🔥 base factory
const base = createCRUDController(Vehiculo, SEARCH_FIELDS);

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
    const [total, porMarca, porTipo, porEstado, porPropiedad] = await Promise.all([
      Vehiculo.countDocuments({ estado: { $ne: "baja" } }),

      Vehiculo.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Marca", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      Vehiculo.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Tipo", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      Vehiculo.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Estado fisico del vehículo", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      Vehiculo.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Propiedad del Ayuntamiento / Comodato", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total,
        top_marcas: porMarca,
        por_tipo: porTipo,
        por_estado_fisico: porEstado,
        por_dependencia: porPropiedad
      }
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};