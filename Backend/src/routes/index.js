import { Router } from "express";
import eventoRoutes from "./eventoRoutes.js";
const router = Router();
router.use("/eventos", eventoRoutes);
export default router;
