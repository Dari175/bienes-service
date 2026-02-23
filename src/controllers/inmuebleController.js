import Inmueble from "../models/Inmueble.js";

// Todos los campos string de bienes_generales_inmuebles (13 campos)
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

export const getAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 50, uso, forma, situacion, responsable } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const filter = {};
    if (q) { const r = new RegExp(q, "i"); filter.$or = SEARCH_FIELDS.map((f) => ({ [f]: r })); }
    if (uso)         filter["Uso o destino"]          = new RegExp(uso, "i");
    if (forma)       filter["Forma de adquisición"]   = new RegExp(forma, "i");
    if (situacion)   filter["Situación legal del bien inmueble"] = new RegExp(situacion, "i");
    if (responsable) filter["Responsable de la guardia y custodia del documento que ampara la propiedad"] = new RegExp(responsable, "i");
    const [docs, total] = await Promise.all([
      Inmueble.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Inmueble.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum), data: docs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getStats = async (req, res) => {
  try {
    const [total, porUso, porForma, porSituacion] = await Promise.all([
      Inmueble.countDocuments(),
      Inmueble.aggregate([{ $group: { _id: "$Uso o destino", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Inmueble.aggregate([{ $group: { _id: "$Forma de adquisición", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Inmueble.aggregate([{ $group: { _id: "$Situación legal del bien inmueble", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);
    res.json({ success: true, data: { total, por_uso: porUso, por_forma_adquisicion: porForma, por_situacion_legal: porSituacion } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getById = async (req, res) => {
  try {
    const doc = await Inmueble.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Inmueble no encontrado" });
    res.json({ success: true, data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = await Inmueble.create(req.body);
    res.status(201).json({ success: true, message: "Inmueble creado exitosamente", data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const update = async (req, res) => {
  try {
    const doc = await Inmueble.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Inmueble no encontrado" });
    res.json({ success: true, message: "Inmueble actualizado exitosamente", data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
export const patch = update;

export const remove = async (req, res) => {
  try {
    const doc = await Inmueble.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Inmueble no encontrado" });
    res.json({ success: true, message: "Inmueble eliminado exitosamente", data: { _id: doc._id } });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
