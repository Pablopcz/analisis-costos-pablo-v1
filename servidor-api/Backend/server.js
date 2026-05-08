import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import dns from "node:dns";
import proyectosRoutes from "./routes/proyectos.routes.js";

// 👇 FUERZA DNS (ESTO ARREGLA TODO)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/proyectos", proyectosRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend MEAN funcionando");
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado correctamente");
    app.listen(PORT, () => {
      console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Error conectando a MongoDB:", err);
  });