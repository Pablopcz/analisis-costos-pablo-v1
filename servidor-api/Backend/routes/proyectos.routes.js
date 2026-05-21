import { Router } from "express";
import Proyecto from "../models/proyecto.model.js";

const router = Router();

// ✅ GET → obtener todos (para tablas + gráficas)
router.get("/", async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);

  } catch (error) {
    console.error("🔥 ERROR REAL:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ POST → guardar proyecto
router.post("/", async (req, res) => {
  try {
    const nuevo = await Proyecto.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("🔥 ERROR GUARDAR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ DELETE → eliminar proyecto
router.delete("/:id", async (req, res) => {
  try {
    await Proyecto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Proyecto eliminado" });
  } catch (error) {
    console.error("🔥 ERROR ELIMINAR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;