import mongoose from "mongoose";

/**
 * Colección: bienes_generales_computo
 * 568 documentos — Equipo de cómputo y telecomunicaciones
 */
const computoSchema = new mongoose.Schema(
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
    "FECHA DE ADQUISICIÓN": { type: mongoose.Schema.Types.Mixed },
    "VALOR DE ADQUISICIÓN": { type: mongoose.Schema.Types.Mixed },
    "CONDICIÓN FÍSICA DEL BIEN ": { type: String, trim: true }, // tiene espacio al final
    "OBSERVACIÓN": { type: mongoose.Schema.Types.Mixed },
  },
  {
    collection: "bienes_generales_computo",
    strict: false,
  }
);

computoSchema.index({ "NO. DE INVENTARIO": 1 });
computoSchema.index({ "NO. DE RESGUARDO": 1 });
computoSchema.index({ "NOMBRE DEL RESGUARDANTE": 1 });
computoSchema.index({ "UNIDAD ADMINISTRATIVA": 1 });
computoSchema.index({ "MARCA": 1 });

export default mongoose.model("Computo", computoSchema);
