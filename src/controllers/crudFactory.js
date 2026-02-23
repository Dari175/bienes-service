/**
 * Fábrica de controladores CRUD genéricos para MongoDB/Mongoose.
 * Cada colección tiene sus particularidades, pero comparten la misma lógica base.
 */

/**
 * Construye un filtro de búsqueda de texto sobre los campos indicados.
 */
const buildSearchFilter = (q, searchFields) => {
  if (!q) return {};
  const regex = new RegExp(q, "i");
  return { $or: searchFields.map((f) => ({ [f]: regex })) };
};

/**
 * Crea un set de controladores CRUD para un modelo dado.
 * @param {mongoose.Model} Model
 * @param {string[]} searchFields - campos sobre los que opera GET /?q=
 */
export const createCRUDController = (Model, searchFields = []) => {
  // ── GET /  (lista + búsqueda + paginación) ───────────────────────────
  const getAll = async (req, res) => {
    try {
      const { q, page = 1, limit = 50, ...filters } = req.query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      // Filtros directos por campo exacto (case-insensitive para strings)
      const fieldFilter = {};
      for (const [key, val] of Object.entries(filters)) {
        fieldFilter[key] = new RegExp(val, "i");
      }

      // Búsqueda de texto libre
      const searchFilter = buildSearchFilter(q, searchFields);

      const filter = {
        ...(Object.keys(fieldFilter).length ? fieldFilter : {}),
        ...(Object.keys(searchFilter).length ? searchFilter : {}),
      };

      const [docs, total] = await Promise.all([
        Model.find(filter).skip(skip).limit(limitNum).lean(),
        Model.countDocuments(filter),
      ]);

      res.json({
        success: true,
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        data: docs,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── GET /:id ──────────────────────────────────────────────────────────
  const getById = async (req, res) => {
    try {
      const doc = await Model.findById(req.params.id).lean();
      if (!doc) {
        return res.status(404).json({ success: false, message: "Documento no encontrado" });
      }
      res.json({ success: true, data: doc });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ success: false, message: "ID inválido" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── POST / ────────────────────────────────────────────────────────────
  const create = async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({
        success: true,
        message: "Documento creado exitosamente",
        data: doc,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── PUT /:id ──────────────────────────────────────────────────────────
  const update = async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).lean();

      if (!doc) {
        return res.status(404).json({ success: false, message: "Documento no encontrado" });
      }
      res.json({
        success: true,
        message: "Documento actualizado exitosamente",
        data: doc,
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ success: false, message: "ID inválido" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── PATCH /:id  (actualización parcial, igual a PUT aquí) ─────────────
  const patch = update;

  // ── DELETE /:id ───────────────────────────────────────────────────────
  const remove = async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id).lean();
      if (!doc) {
        return res.status(404).json({ success: false, message: "Documento no encontrado" });
      }
      res.json({
        success: true,
        message: "Documento eliminado exitosamente",
        data: { _id: doc._id },
      });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ success: false, message: "ID inválido" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── GET /stats ────────────────────────────────────────────────────────
  const stats = async (req, res) => {
    try {
      const total = await Model.countDocuments();
      res.json({ success: true, data: { total, collection: Model.collection.name } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  return { getAll, getById, create, update, patch, remove, stats };
};
