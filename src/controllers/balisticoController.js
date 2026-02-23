import Balistico from "../models/Balistico.js";

// Todos los campos de bienes_generales_equipo_balistico (7 campos)
const SEARCH_FIELDS = [
  "Nombre del resguardante",
  "Descripción",
  "Marca",
  "Modelo",
  "No. Serie",
  "Observaciones",
];

export const getAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 50, resguardante } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const filter = {};
    if (q) { const r = new RegExp(q, "i"); filter.$or = SEARCH_FIELDS.map((f) => ({ [f]: r })); }
    if (resguardante) filter["Nombre del resguardante"] = new RegExp(resguardante, "i");
    const [docs, total] = await Promise.all([
      Balistico.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Balistico.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum), data: docs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getStats = async (req, res) => {
  try {
    const [total, porTipo] = await Promise.all([
      Balistico.countDocuments(),
      Balistico.aggregate([
        { $group: { _id: "$Descripción", totalUnidades: { $sum: "$Unidad" }, registros: { $sum: 1 } } },
        { $sort: { totalUnidades: -1 } },
      ]),
    ]);
    res.json({ success: true, data: { total, por_tipo: porTipo } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getById = async (req, res) => {
  try {
    const doc = await Balistico.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Equipo balístico no encontrado" });
    res.json({ success: true, data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = await Balistico.create(req.body);
    res.status(201).json({ success: true, message: "Equipo balístico creado exitosamente", data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const update = async (req, res) => {
  try {
    const doc = await Balistico.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Equipo balístico no encontrado" });
    res.json({ success: true, message: "Equipo balístico actualizado exitosamente", data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
export const patch = update;

export const remove = async (req, res) => {
  try {
    const doc = await Balistico.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Equipo balístico no encontrado" });
    res.json({ success: true, message: "Equipo balístico eliminado exitosamente", data: { _id: doc._id } });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
