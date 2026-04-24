import Balistico from "../models/Balistico.js";
import { createCRUDController } from "../utils/crudFactory.js";

// campos de búsqueda
const SEARCH_FIELDS = [
  "Nombre del resguardante",
  "Descripción",
  "Marca",
  "Modelo",
  "No. Serie",
  "Observaciones",
];

// 🔥 base del factory
const base = createCRUDController(Balistico, SEARCH_FIELDS);

// ─────────────────────────────────────────────
// reutilizas TODO lo genérico
export const getAll = base.getAll;
export const getById = base.getById;
export const create = base.create;
export const update = base.update;
export const patch = base.patch;
export const remove = base.remove;

// ─────────────────────────────────────────────
// mantienes lo personalizado (NO lo pierdes)
export const getStats = async (req, res) => {
  try {
    const [total, porTipo] = await Promise.all([
      Balistico.countDocuments({ estado: { $ne: "baja" } }),
      Balistico.aggregate([
        { $match: { estado: { $ne: "baja" } } },
        { $group: { _id: "$Descripción", totalUnidades: { $sum: "$Unidad" }, registros: { $sum: 1 } } },
        { $sort: { totalUnidades: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: { total, por_tipo: porTipo }
    });

  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};