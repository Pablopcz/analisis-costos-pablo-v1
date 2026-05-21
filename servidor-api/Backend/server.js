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
const PORT = process.env.PORT || 4000;

// ✅ CONEXIÓN A MONGO (AHORA CONTROLA EL ARRANQUE)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado correctamente");

    // 🔥 SOLO CAMBIO AQUÍ
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend escuchando en puerto ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
  });
