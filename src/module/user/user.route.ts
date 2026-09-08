import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middlewares/checkAuth";
import { UserController } from "./user.controller";
import {ProfileValidation} from "./user.validation";
import {validateRequest} from "../../middlewares/validateRequest";

const router = Router();

router.patch(
    "/profile-image",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMER, Role.BUYER),
    upload.single("profileImage"),
    UserController.uploadProfileImage,
);

router.patch(
    "/update-profile",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.EXPERT, Role.FARMER, Role.BUYER), // সব অথেনটিকেটেড রোল পারমিটেড
    validateRequest(ProfileValidation.updateProfileValidationSchema),
    UserController.updateProfile
);

export const UserRoutes = router;