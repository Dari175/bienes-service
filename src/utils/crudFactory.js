/**
 * CRUD Factory PRO - Soft delete + restore + auditoría + roles
 */

// ─────────────────────────────────────────────
// 🔥 CONSTANTES
const STATUS = {
  ACTIVO: "activo",
  BAJA: "baja"
};

// ─────────────────────────────────────────────
// 🔍 Búsqueda
const buildSearchFilter = (q, searchFields) => {
  if (!q) return {};
  const regex = new RegExp(q, "i");
  return { $or: searchFields.map((f) => ({ [f]: regex })) };
};

// ─────────────────────────────────────────────
// 🧠 HISTORIAL
const buildHistorial = (accion, user) => ({
  accion,
  por: user,
  fecha: new Date()
});

// ─────────────────────────────────────────────
// 🧾 LOG (opcional simple)
const logAction = (accion, modelName, user) => {
  console.log(`[AUDIT] ${accion} | ${modelName} | ${user} | ${new Date().toISOString()}`);
};

// ─────────────────────────────────────────────
// 🔥 SOFT DELETE
const softDelete = async (Model, id, user) => {
  const result = await Model.collection.findOneAndUpdate(
    { _id: new Model.base.Types.ObjectId(id) },
    {
      $set: {
        estado: STATUS.BAJA,
        baja: {
          por: user,
          fecha: new Date()
        }
      },
      $push: {
        historial: buildHistorial("baja", user)
      }
    },
    { returnDocument: "after" }
  );

  logAction("DELETE_SOFT", Model.collection.name, user);

  return result;
};

// ─────────────────────────────────────────────
// ♻️ RESTORE
const restoreDoc = async (Model, id, user) => {
  const result = await Model.collection.findOneAndUpdate(
    { _id: new Model.base.Types.ObjectId(id) },
    {
      $set: {
        estado: STATUS.ACTIVO,
        baja: null
      },
      $push: {
        historial: buildHistorial("restore", user)
      }
    },
    { returnDocument: "after" }
  );

  logAction("RESTORE", Model.collection.name, user);

  return result;
};

// ─────────────────────────────────────────────
// 🔐 ROLE CHECK (simple, no rompe nada)
const canViewDeleted = (req) => {
  // por ahora TODOS pueden, pero luego puedes restringir
  return req.query.includeDeleted === "true";
};

// ─────────────────────────────────────────────
// 🚀 FACTORY
export const createCRUDController = (Model, searchFields = []) => {

  // ── GET / ─────────────────────────────
  const getAll = async (req, res) => {
    try {
      const { q, page = 1, limit = 50, ...filters } = req.query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const fieldFilter = {};
      for (const [key, val] of Object.entries(filters)) {
        fieldFilter[key] = new RegExp(val, "i");
      }

      const searchFilter = buildSearchFilter(q, searchFields);

      const baseFilter = {
        ...(Object.keys(fieldFilter).length ? fieldFilter : {}),
        ...(Object.keys(searchFilter).length ? searchFilter : {}),
      };

      const filter = canViewDeleted(req)
        ? baseFilter
        : { estado: { $ne: STATUS.BAJA }, ...baseFilter };

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

  // ── GET /:id ──────────────────────────
  const getById = async (req, res) => {
    try {
      const filter = {
        _id: req.params.id,
        ...(canViewDeleted(req) ? {} : { estado: { $ne: STATUS.BAJA } })
      };

      const doc = await Model.findOne(filter).lean();

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "Documento no encontrado"
        });
      }

      res.json({ success: true, data: doc });

    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ success: false, message: "ID inválido" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── POST ─────────────────────────────
  const create = async (req, res) => {
    try {
      const user = req.user?.id || "sistema";

      const doc = {
        ...req.body,
        estado: STATUS.ACTIVO,
        historial: [buildHistorial("create", user)]
      };

      await Model.collection.insertOne(doc);

      logAction("CREATE", Model.collection.name, user);

      res.status(201).json({
        success: true,
        message: "Documento creado",
        data: doc,
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── UPDATE ───────────────────────────
  const update = async (req, res) => {
    try {
      const user = req.user?.id || "sistema";

      const result = await Model.collection.findOneAndUpdate(
        { _id: new Model.base.Types.ObjectId(req.params.id) },
        {
          $set: req.body,
          $push: {
            historial: buildHistorial("update", user)
          }
        },
        { returnDocument: "after" }
      );

      if (!result.value) {
        return res.status(404).json({
          success: false,
          message: "Documento no encontrado"
        });
      }

      logAction("UPDATE", Model.collection.name, user);

      res.json({
        success: true,
        message: "Documento actualizado",
        data: result.value
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  const patch = update;

  // ── DELETE (SOFT) ─────────────────────
  const remove = async (req, res) => {
    try {
      const user = req.user?.id || "sistema";

      const result = await softDelete(Model, req.params.id, user);

      if (!result.value) {
        return res.status(404).json({
          success: false,
          message: "Documento no encontrado"
        });
      }

      res.json({
        success: true,
        message: "Documento dado de baja",
        data: result.value
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── RESTORE (no rompe nada si no lo usas aún) ─────────────
  const restore = async (req, res) => {
    try {
      const user = req.user?.id || "sistema";

      const result = await restoreDoc(Model, req.params.id, user);

      if (!result.value) {
        return res.status(404).json({
          success: false,
          message: "Documento no encontrado"
        });
      }

      res.json({
        success: true,
        message: "Documento restaurado",
        data: result.value
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // ── STATS ────────────────────────────
  const stats = async (req, res) => {
    try {
      const total = await Model.countDocuments({
        estado: { $ne: STATUS.BAJA }
      });

      res.json({
        success: true,
        data: {
          total,
          collection: Model.collection.name
        }
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  return {
    getAll,
    getById,
    create,
    update,
    patch,
    remove,
    restore, // listo pero no obligatorio usarlo aún
    stats
  };
};