import { Router } from "express";
import mesaController from "../controllers/MesaController.js";
import { autenticar } from "../middlewares/autenticar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { Rol } from "../enums/Rol.js";
const router = Router();
router.get("/", autenticar, autorizar(Rol.EMPLEADO, Rol.ADMINISTRADOR), mesaController.getAll);
export default router;
