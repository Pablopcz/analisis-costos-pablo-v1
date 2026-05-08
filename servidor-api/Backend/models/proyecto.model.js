import mongoose from "mongoose";

const proyectoSchema = new mongoose.Schema({
  nombre: String,
  horasEstimadas: Number,
  horasReales: Number,
  costoHora: Number,
  costoTotal: Number,
  estado: String
}, { timestamps: true });

export default mongoose.model("Proyecto", proyectoSchema);