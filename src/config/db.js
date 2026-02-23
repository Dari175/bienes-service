// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "PatrimonioDB"  // ← agrega esta línea con el nombre exacto
    });
    console.log("MongoDB conectado ✅");
  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exit(1);
  }
};

export default connectDB;