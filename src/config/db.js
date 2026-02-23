import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "PatrimonioDB"  // ← agrega esto con el nombre exacto de tu BD en Atlas
    });
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log("DB NAME:", conn.connection.name);
console.log("DB HOST:", conn.connection.host);

const collections = await mongoose.connection.db.listCollections().toArray();
console.log("COLLECTIONS:", collections.map(c => c.name));
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    process.exit(1);
  }
};