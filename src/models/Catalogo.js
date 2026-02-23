import mongoose from "mongoose";

/**
 * Colección: bienes_generales_catalogo
 * 43 documentos — Catálogo de cuentas armonizadas y clasificador por objeto de gasto
 */
const subcuentaSchema = new mongoose.Schema({
  clave: { type: String, trim: true },
  descripcion: { type: String, trim: true },
}, { _id: false });

const clasificadorSchema = new mongoose.Schema({
  codigo: { type: Number },
  descripcion: { type: String, trim: true },
}, { _id: false });

const catalogoSchema = new mongoose.Schema(
  {
    "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD": subcuentaSchema,
    "CLASIFICADOR POR OBJETO DE GASTO": clasificadorSchema,
  },
  {
    collection: "bienes_generales_catalogo",
    strict: false,
  }
);

catalogoSchema.index({ "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD.clave": 1 });
catalogoSchema.index({ "CLASIFICADOR POR OBJETO DE GASTO.codigo": 1 });

export default mongoose.model("Catalogo", catalogoSchema);
