import { Router } from "express";
import authController from "../controllers/AuthController.js";
import { autenticar } from "../middlewares/autenticar.js";
const router = Router();
router.post("/registro", authController.registrar);
router.post("/login", authController.iniciarSesion);
router.get("/perfil", autenticar, authController.perfil);
export default router;
