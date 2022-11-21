import express  from "express";
import walletRouter from "./walletRouter.js";
import authRouter from "./authRouter.js";

const router = express.Router();
router.use(authRouter);
router.use(walletRouter);
export default router;