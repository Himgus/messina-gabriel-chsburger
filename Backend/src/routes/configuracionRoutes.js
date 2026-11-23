import { Router } from "express";
import configuracionController from "../controllers/ConfiguracionController.js";
import { autenticar } from "../middlewares/autenticar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { Rol } from "../enums/Rol.js";
const router = Router();
router.get("/", configuracionController.get);
router.put("/", autenticar, autorizar(Rol.ADMINISTRADOR), configuracionController.update);
export default router;
