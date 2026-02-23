import mongoose from "mongoose";

/**
 * Colección: bienes_generales_equipo_balistico
 * 8 documentos — Equipo balístico (chalecos, escudos, etc.)
 * Estructura más simple, sin número de inventario/resguardo numérico
 */
const balisticoSchema = new mongoose.Schema(
  {
    "Nombre del resguardante": { type: String, trim: true },
    "Unidad": { type: Number }, // cantidad de unidades
    "Descripción": { type: String, trim: true },
    "Marca": { type: String, trim: true },
    "Modelo": { type: String, trim: true },
    "No. Serie": { type: String, trim: true },
    "Observaciones": { type: mongoose.Schema.Types.Mixed },
  },
  {
    collection: "bienes_generales_equipo_balistico",
    strict: false,
  }
);

balisticoSchema.index({ "Nombre del resguardante": 1 });
balisticoSchema.index({ "Descripción": 1 });

export default mongoose.model("Balistico", balisticoSchema);
