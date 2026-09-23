import { Router } from "express";
import eventoController from "../controllers/EventoController.js";
const router = Router();
router.get("/", eventoController.getAll);
router.get("/:id", eventoController.getById);
router.post("/", eventoController.create);
router.put("/:id", eventoController.update);
router.delete("/:id", eventoController.delete);
export default router;
