import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import dns from "node:dns";
import proyectosRoutes from "./routes/proyectos.routes.js";

// DNS (opcional)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/proyectos", proyectosRoutes);

// Ruta root
app.get("/", (req, res) => {
  res.send("✅ Backend MEAN funcionando");
});

// ✅ Puerto de Railway
// ✅ Puerto
const PORT = process.env.PORT || 4000;

// ✅ ARRANCAR SIEMPRE EL SERVIDOR
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend escuchando en puerto ${PORT}`);
});

// ✅ CONEXIÓN A MONGO (NO bloquea)
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // 🔥 IMPORTANTE
  })
  .then(() => {
    console.log("✅ Mongo conectado correctamente");
  })
  .catch((err) => {
    console.error("❌ Error Mongo:", err);
  });
``