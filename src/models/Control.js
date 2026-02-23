import mongoose from "mongoose";

/**
 * Colección: bienes_control
 * 841 documentos — Bienes de control (mobiliario menor, utensilios, etc.)
 * Similar a muebles pero con campo UNIDAD (cantidad) y campos de texto diferentes
 */
const controlSchema = new mongoose.Schema(
  {
    "NO. RESGUARDO": { type: String, trim: true },       // puede ser "1 ATTO", no numérico
    "NO. DE INVENTARIO": { type: String, trim: true },   // ídem
    "CLAVE ARMONIZADA": { type: String, trim: true },
    "NOMBRE DEL RESGUARDANTE": { type: String, trim: true },
    "UNIDAD ADMINISTRATIVA": { type: String, trim: true },
    "UBICACIÓN ACTUAL": { type: String, trim: true },
    "UNIDAD": { type: String, trim: true },              // cantidad, viene como string
    "DESCRIPCIÓN": { type: String, trim: true },
    "MARCA": { type: String, trim: true },
    "MODELO": { type: String, trim: true },
    "NÚMERO DE SERIE": { type: String, trim: true },
    "FACTURA O DOCUMENTO QUE AMPARA": { type: String, trim: true },
    "FECHA DE ADQUISICIÓN": { type: String, trim: true },
    "VALOR DE ADQUISICIÓN": { type: String, trim: true },
    "CONDICIÓN FÍSICA DEL BIEN": { type: String, trim: true },
    "OBSERVACIÓNES": { type: String, trim: true },       // así está en la BD (con acento)
  },
  {
    collection: "bienes_control",
    strict: false,
  }
);

controlSchema.index({ "NO. DE INVENTARIO": 1 });
controlSchema.index({ "NO. RESGUARDO": 1 });
controlSchema.index({ "NOMBRE DEL RESGUARDANTE": 1 });
controlSchema.index({ "UNIDAD ADMINISTRATIVA": 1 });
controlSchema.index({ "CONDICIÓN FÍSICA DEL BIEN": 1 });

export default mongoose.model("Control", controlSchema);
