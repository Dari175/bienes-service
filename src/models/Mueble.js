import mongoose from "mongoose";

/**
 * Colección: bienes_generales_muebles
 * 2,230 documentos — Mobiliario en resguardo
 * Campos reales observados en los documentos BSON
 */
const muebleSchema = new mongoose.Schema(
  {
    "NO. DE RESGUARDO": { type: Number },
    "NO. DE INVENTARIO": { type: Number },
    "CLAVE ARMONIZADA": { type: String, trim: true },
    "NOMBRE DEL RESGUARDANTE": { type: String, trim: true },
    "UNIDAD ADMINISTRATIVA": { type: String, trim: true },
    "UBICACIÓN ACTUAL": { type: String, trim: true },
    "DESCRIPCIÓN FÍSICA DEL BIEN": { type: String, trim: true },
    "MARCA": { type: String, trim: true },
    "MODELO": { type: String, trim: true },
    "NO. DE SERIE": { type: String, trim: true },
    "FACTURA O DOCUMENTO QUE AMPARA": { type: String, trim: true },
    "FECHA DE ADQUISICIÓN ": { type: mongoose.Schema.Types.Mixed }, // tiene espacio al final
    "VALOR DE ADQUISICIÓN": { type: mongoose.Schema.Types.Mixed },
    "CONDICIÓN FÍSICA DEL BIEN": { type: String, trim: true },
  },
  {
    collection: "bienes_generales_muebles",
    strict: false, // acepta campos extra
  }
);

// Índices para búsquedas frecuentes
muebleSchema.index({ "NO. DE INVENTARIO": 1 });
muebleSchema.index({ "NO. DE RESGUARDO": 1 });
muebleSchema.index({ "NOMBRE DEL RESGUARDANTE": 1 });
muebleSchema.index({ "UNIDAD ADMINISTRATIVA": 1 });
muebleSchema.index({ "CONDICIÓN FÍSICA DEL BIEN": 1 });

export default mongoose.model("Mueble", muebleSchema);
