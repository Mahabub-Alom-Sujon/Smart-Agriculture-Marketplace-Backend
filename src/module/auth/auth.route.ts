import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { AuthController } from "./auth.controller";

const router = Router();




router.get(
    "/me",
    auth(Role.ADMIN, Role.FARMER, Role.BUYER, Role.EXPERT, Role.SUPER_ADMIN),
    AuthController.getMe,
);

router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", AuthController.googleLogin);
export const AuthRoutes = router;