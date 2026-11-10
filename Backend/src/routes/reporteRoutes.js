import { Router } from "express";
import reporteController from "../controllers/ReporteController.js";
import { autenticar } from "../middlewares/autenticar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { Rol } from "../enums/Rol.js";
const router = Router();
router.get("/ocupacion", autenticar, autorizar(Rol.ADMINISTRADOR), reporteController.ocupacion);
export default router;
