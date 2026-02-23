import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Ruta raíz (health check) ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "Patrimonio Municipal — Microservicio",
    version: "1.0.0",
    endpoints: {
      stats:     "GET /api/stats",
      search:    "GET /api/search?q=texto",
      muebles:   "/api/muebles",
      computo:   "/api/computo",
      balistico: "/api/balistico",
      inmuebles: "/api/inmuebles",
      vehiculos: "/api/vehiculos",
      control:   "/api/control",
      catalogo:  "/api/catalogo",
    },
  });
});

// ── Rutas API ────────────────────────────────────────────────────────────────
app.use("/api", apiRouter);

// ── Manejo de errores ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Iniciar servidor ─────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📦 Ambiente: ${process.env.NODE_ENV || "development"}`);
  });
});

export default app;
