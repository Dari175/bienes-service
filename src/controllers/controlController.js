import Control from "../models/Control.js";

// Todos los campos string de bienes_control (16 campos)
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
  "OBSERVACIÓNES",              // así está escrito en la BD (con acento)
];

export const getAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 50, unidad, condicion, resguardante } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const filter = {};
    if (q) { const r = new RegExp(q, "i"); filter.$or = SEARCH_FIELDS.map((f) => ({ [f]: r })); }
    if (unidad)       filter["UNIDAD ADMINISTRATIVA"]     = new RegExp(unidad, "i");
    if (condicion)    filter["CONDICIÓN FÍSICA DEL BIEN"] = new RegExp(condicion, "i");
    if (resguardante) filter["NOMBRE DEL RESGUARDANTE"]   = new RegExp(resguardante, "i");
    const [docs, total] = await Promise.all([
      Control.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Control.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum), data: docs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getStats = async (req, res) => {
  try {
    const [total, porCondicion, porUnidad] = await Promise.all([
      Control.countDocuments(),
      Control.aggregate([{ $group: { _id: "$CONDICIÓN FÍSICA DEL BIEN", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Control.aggregate([{ $group: { _id: "$UNIDAD ADMINISTRATIVA", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);
    res.json({ success: true, data: { total, por_condicion: porCondicion, top_unidades: porUnidad } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getById = async (req, res) => {
  try {
    const doc = await Control.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Bien de control no encontrado" });
    res.json({ success: true, data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = await Control.create(req.body);
    res.status(201).json({ success: true, message: "Bien de control creado exitosamente", data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const update = async (req, res) => {
  try {
    const doc = await Control.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Bien de control no encontrado" });
    res.json({ success: true, message: "Bien de control actualizado exitosamente", data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
export const patch = update;

export const remove = async (req, res) => {
  try {
    const doc = await Control.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Bien de control no encontrado" });
    res.json({ success: true, message: "Bien de control eliminado exitosamente", data: { _id: doc._id } });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
