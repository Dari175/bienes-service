import Catalogo from "../models/Catalogo.js";

// GET /api/catalogo
export const getCatalogos = async (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (q) {
      filter.$or = [
        { "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD.clave": new RegExp(q, "i") },
        { "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD.descripcion": new RegExp(q, "i") },
        { "CLASIFICADOR POR OBJETO DE GASTO.descripcion": new RegExp(q, "i") },
      ];
    }

    const [docs, total] = await Promise.all([
      Catalogo.find(filter).skip(skip).limit(limitNum).lean(),
      Catalogo.countDocuments(filter),
    ]);

    // Aplanar para facilitar uso
    const data = docs.map((d) => ({
      _id: d._id,
      subcuenta_clave: d["SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD"]?.clave,
      subcuenta_descripcion: d["SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD"]?.descripcion,
      clasificador_codigo: d["CLASIFICADOR POR OBJETO DE GASTO"]?.codigo,
      clasificador_descripcion: d["CLASIFICADOR POR OBJETO DE GASTO"]?.descripcion,
      _raw: d,
    }));

    res.json({ success: true, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum), data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/catalogo/stats
export const getCatalogosStats = async (req, res) => {
  try {
    const total = await Catalogo.countDocuments();
    res.json({ success: true, data: { total, coleccion: "bienes_generales_catalogo" } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/catalogo/:id
export const getCatalogoById = async (req, res) => {
  try {
    const doc = await Catalogo.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Catálogo no encontrado" });
    res.json({
      success: true,
      data: {
        _id: doc._id,
        subcuenta_clave: doc["SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD"]?.clave,
        subcuenta_descripcion: doc["SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD"]?.descripcion,
        clasificador_codigo: doc["CLASIFICADOR POR OBJETO DE GASTO"]?.codigo,
        clasificador_descripcion: doc["CLASIFICADOR POR OBJETO DE GASTO"]?.descripcion,
        _raw: doc,
      },
    });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/catalogo
export const createCatalogo = async (req, res) => {
  try {
    const doc = await Catalogo.create(req.body);
    res.status(201).json({ success: true, message: "Catálogo creado", data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/catalogo/:id
export const updateCatalogo = async (req, res) => {
  try {
    const doc = await Catalogo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Catálogo no encontrado" });
    res.json({ success: true, message: "Catálogo actualizado", data: doc });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/catalogo/:id
export const deleteCatalogo = async (req, res) => {
  try {
    const doc = await Catalogo.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Catálogo no encontrado" });
    res.json({ success: true, message: "Catálogo eliminado", data: { _id: doc._id } });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "ID inválido" });
    res.status(500).json({ success: false, message: error.message });
  }
};
