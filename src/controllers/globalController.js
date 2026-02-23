import Mueble from "../models/Mueble.js";
import Computo from "../models/Computo.js";
import Balistico from "../models/Balistico.js";
import Inmueble from "../models/Inmueble.js";
import Vehiculo from "../models/Vehiculo.js";
import Control from "../models/Control.js";
import Catalogo from "../models/Catalogo.js";

// GET /api/stats
export const getGlobalStats = async (req, res) => {
  try {
    const [muebles, computo, balistico, inmuebles, vehiculos, control, catalogo] =
      await Promise.all([
        Mueble.countDocuments(),
        Computo.countDocuments(),
        Balistico.countDocuments(),
        Inmueble.countDocuments(),
        Vehiculo.countDocuments(),
        Control.countDocuments(),
        Catalogo.countDocuments(),
      ]);

    res.json({
      success: true,
      data: {
        total_bienes: muebles + computo + balistico + inmuebles + vehiculos + control,
        colecciones: {
          muebles,
          computo,
          equipo_balistico: balistico,
          inmuebles,
          parque_vehicular: vehiculos,
          bienes_control: control,
          catalogo,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/search?q=texto
export const globalSearch = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Parámetro 'q' requerido" });
    }

    const lim = Math.min(20, Math.max(1, parseInt(limit)));
    const regex = new RegExp(q, "i");

    const [muebles, computo, balistico, inmuebles, vehiculos, control] = await Promise.all([
      Mueble.find({
        $or: [
          { "NOMBRE DEL RESGUARDANTE": regex },
          { "DESCRIPCIÓN FÍSICA DEL BIEN": regex },
          { "UNIDAD ADMINISTRATIVA": regex },
          { "MARCA": regex },
          { "CLAVE ARMONIZADA": regex },
        ],
      }).limit(lim).lean(),

      Computo.find({
        $or: [
          { "NOMBRE DEL RESGUARDANTE": regex },
          { "DESCRIPCIÓN FÍSICA DEL BIEN": regex },
          { "MARCA": regex },
          { "MODELO": regex },
          { "NO. DE SERIE": regex },
        ],
      }).limit(lim).lean(),

      Balistico.find({
        $or: [
          { "Nombre del resguardante": regex },
          { "Descripción": regex },
        ],
      }).limit(lim).lean(),

      Inmueble.find({
        $or: [
          { "Número de inventario": regex },
          { "Descripción del bien inmueble": regex },
          { "Ubicación": regex },
          { "Responsable de la guardia y custodia del documento que ampara la propiedad": regex },
        ],
      }).limit(lim).lean(),

      Vehiculo.find({
        $or: [
          { "Nombre del Resguardante": regex },
          { "Marca": regex },
          { "Placas": regex },
          { "Serie": regex },
          { "Propiedad del Ayuntamiento / Comodato": regex },
        ],
      }).limit(lim).lean(),

      Control.find({
        $or: [
          { "NOMBRE DEL RESGUARDANTE": regex },
          { "DESCRIPCIÓN": regex },
          { "UNIDAD ADMINISTRATIVA": regex },
          { "CLAVE ARMONIZADA": regex },
        ],
      }).limit(lim).lean(),
    ]);

    const total = muebles.length + computo.length + balistico.length +
                  inmuebles.length + vehiculos.length + control.length;

    res.json({
      success: true,
      query: q,
      total_resultados: total,
      data: { muebles, computo, balistico, inmuebles, vehiculos, control },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
