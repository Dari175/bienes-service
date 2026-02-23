import Computo from "../models/Computo.js";

// Todos los campos string de bienes_generales_computo (15 campos)
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
  "CONDICIÓN FÍSICA DEL BIEN ",   // tiene espacio al final en la BD
  "OBSERVACIÓN",
];

export const getAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 50, marca, unidad, condicion, resguardante } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const filter = {};
    if (q) { const r = new RegExp(q, "i"); filter.$or = SEARCH_FIELDS.map((f) => ({ [f]: r })); }
    if (marca)        filter["MARCA"]                       = new RegExp(marca, "i");
    if (unidad)       filter["UNIDAD ADMINISTRATIVA"]       = new RegExp(unidad, "i");
    if (condicion)    filter["CONDICIÓN FÍSICA DEL BIEN "]  = new RegExp(condicion, "i");
    if (resguardante) filter["NOMBRE DEL RESGUARDANTE"]     = new RegExp(resguardante, "i");
    const [docs, total] = await Promise.all([
      Computo.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Computo.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum), data: docs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getStats = async (req, res) => {
  try {
    const [total, porMarca, porCondicion, porUnidad] = await Promise.all([
      Computo.countDocuments(),
      Computo.aggregate([{ $group: { _id: "$MARCA", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Computo.aggregate([{ $group: { _id: "$CONDICIÓN FÍSICA DEL BIEN ", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Computo.aggregate([{ $group: { _id: "$UNIDAD ADMINISTRATIVA", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);
    res.json({ success: true, data: { total, top_marcas: porMarca, por_condicion: porCondicion, top_unidades: porUnidad } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getById = async (req, res) => {
  try {
    const doc = await Computo.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Equipo de cómputo no encontrado" });
    res.json({ success: true, data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = await Computo.create(req.body);
    res.status(201).json({ success: true, message: "Equipo de cómputo creado exitosamente", data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const update = async (req, res) => {
  try {
    const doc = await Computo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Equipo de cómputo no encontrado" });
    res.json({ success: true, message: "Equipo de cómputo actualizado exitosamente", data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
export const patch = update;

export const remove = async (req, res) => {
  try {
    const doc = await Computo.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Equipo de cómputo no encontrado" });
    res.json({ success: true, message: "Equipo de cómputo eliminado exitosamente", data: { _id: doc._id } });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
