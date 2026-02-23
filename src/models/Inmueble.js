import mongoose from "mongoose";

/**
 * Colección: bienes_generales_inmuebles
 * 51 documentos — Bienes inmuebles (terrenos, edificios)
 * Fecha de adquisición viene como timestamp Unix en milisegundos
 */
const inmuebleSchema = new mongoose.Schema(
  {
    "Número de inventario": { type: String, trim: true },
    "Clave Armonizada": { type: String, trim: true },
    "Descripción del bien inmueble": { type: String, trim: true },
    "Número del documento que ampara la propiedad del bien": { type: String, trim: true },
    "Documento que ampara la propiedad del bien": { type: String, trim: true },
    "Responsable de la guardia y custodia del documento que ampara la propiedad": { type: String, trim: true },
    "Situación legal del bien inmueble": { type: String, trim: true },
    "Ubicación": { type: String, trim: true },
    "Fecha de adquisición /movimiento": { type: mongoose.Schema.Types.Mixed }, // timestamp ms
    "Valor de adquisición /movimiento": { type: Number },
    "Uso o destino": { type: String, trim: true },
    "Forma de adquisición": { type: String, trim: true },
    "Observaciones": { type: String, trim: true },
  },
  {
    collection: "bienes_generales_inmuebles",
    strict: false,
  }
);

inmuebleSchema.index({ "Número de inventario": 1 });
inmuebleSchema.index({ "Clave Armonizada": 1 });
inmuebleSchema.index({ "Responsable de la guardia y custodia del documento que ampara la propiedad": 1 });

export default mongoose.model("Inmueble", inmuebleSchema);
