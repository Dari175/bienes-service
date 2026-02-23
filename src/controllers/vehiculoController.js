import Vehiculo from "../models/Vehiculo.js";

// Todos los campos string de bienes_generales_parque_vehicular (25 campos)
const SEARCH_FIELDS = [
  "CLAVE ",                                    // tiene espacio al final en la BD
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

export const getAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 50, marca, estado, resguardante, propiedad, tipo } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const filter = {};
    if (q) { const r = new RegExp(q, "i"); filter.$or = SEARCH_FIELDS.map((f) => ({ [f]: r })); }
    if (marca)        filter["Marca"]                                 = new RegExp(marca, "i");
    if (tipo)         filter["Tipo"]                                  = new RegExp(tipo, "i");
    if (estado)       filter["Estado fisico del vehículo"]            = new RegExp(estado, "i");
    if (resguardante) filter["Nombre del Resguardante"]               = new RegExp(resguardante, "i");
    if (propiedad)    filter["Propiedad del Ayuntamiento / Comodato"] = new RegExp(propiedad, "i");
    const [docs, total] = await Promise.all([
      Vehiculo.find(filter).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Vehiculo.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum), data: docs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getStats = async (req, res) => {
  try {
    const [total, porMarca, porTipo, porEstado, porPropiedad] = await Promise.all([
      Vehiculo.countDocuments(),
      Vehiculo.aggregate([{ $group: { _id: "$Marca", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Vehiculo.aggregate([{ $group: { _id: "$Tipo", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
      Vehiculo.aggregate([{ $group: { _id: "$Estado fisico del vehículo", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Vehiculo.aggregate([{ $group: { _id: "$Propiedad del Ayuntamiento / Comodato", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    ]);
    res.json({ success: true, data: { total, top_marcas: porMarca, por_tipo: porTipo, por_estado_fisico: porEstado, por_dependencia: porPropiedad } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const getById = async (req, res) => {
  try {
    const doc = await Vehiculo.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    res.json({ success: true, data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = await Vehiculo.create(req.body);
    res.status(201).json({ success: true, message: "Vehículo creado exitosamente", data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

export const update = async (req, res) => {
  try {
    const doc = await Vehiculo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    res.json({ success: true, message: "Vehículo actualizado exitosamente", data: doc });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
export const patch = update;

export const remove = async (req, res) => {
  try {
    const doc = await Vehiculo.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Vehículo no encontrado" });
    res.json({ success: true, message: "Vehículo eliminado exitosamente", data: { _id: doc._id } });
  } catch (e) {
    if (e.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: e.message });
  }
};
