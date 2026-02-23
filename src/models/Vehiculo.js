import mongoose from "mongoose";

/**
 * Colección: bienes_generales_parque_vehicular
 * 126 documentos — Parque vehicular del municipio
 */
const vehiculoSchema = new mongoose.Schema(
  {
    "No.": { type: Number },
    "No. DE RESGUARDO": { type: Number },
    "No. DE INVENTARIO": { type: Number },
    "CLAVE ": { type: String, trim: true }, // tiene espacio al final en la BD
    "Marca": { type: String, trim: true },
    "Tipo": { type: String, trim: true },
    "Color": { type: String, trim: true },
    "Año/Modelo": { type: mongoose.Schema.Types.Mixed },
    "Placas": { type: String, trim: true },
    "MatrÍcula": { type: String, trim: true },
    "Serie": { type: String, trim: true },
    "No. de Motor": { type: String, trim: true },
    "Tarjeta de circulación": { type: mongoose.Schema.Types.Mixed },
    "Verificación": { type: String, trim: true },
    "Tenencia": { type: String, trim: true },
    "Estado fisico del vehículo": { type: String, trim: true },
    "No. De Factura": { type: mongoose.Schema.Types.Mixed },
    "Fecha de adquisición": { type: mongoose.Schema.Types.Mixed },
    "Valor Factura": { type: mongoose.Schema.Types.Mixed },
    "Precio en libros": { type: mongoose.Schema.Types.Mixed },
    "Nombre del Resguardante": { type: String, trim: true },
    "Propiedad del Ayuntamiento / Comodato": { type: String, trim: true },
    "Ubicación": { type: String, trim: true },
    "Observaciones": { type: mongoose.Schema.Types.Mixed },
  },
  {
    collection: "bienes_generales_parque_vehicular",
    strict: false,
  }
);

vehiculoSchema.index({ "No. DE INVENTARIO": 1 });
vehiculoSchema.index({ "No. DE RESGUARDO": 1 });
vehiculoSchema.index({ "Placas": 1 });
vehiculoSchema.index({ "Serie": 1 });
vehiculoSchema.index({ "Nombre del Resguardante": 1 });
vehiculoSchema.index({ "Marca": 1 });

export default mongoose.model("Vehiculo", vehiculoSchema);
