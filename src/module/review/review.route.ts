import express from "express";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import {validateRequest} from "../../middlewares/validateRequest";

const router = express.Router();


// ==============================
// Buyer Routes
// ==============================

// Create review
router.post(
    "/",
    auth(Role.BUYER),
    validateRequest(
        ReviewValidation.createReviewValidationSchema
    ),
    ReviewController.createReview
);

// Get my reviews
router.get(
    "/my-reviews",
    auth(Role.BUYER),
    ReviewController.getMyReviews
);



// Update my review
router.patch(
    "/:id",
    auth(Role.BUYER),
    validateRequest(
        ReviewValidation.updateReviewValidationSchema
    ),
    ReviewController.updateReview
);

// Delete my review
router.delete(
    "/:id",
    auth(Role.BUYER),
    ReviewController.deleteReview
);

// ==============================
// Public Routes
// ==============================

// Get all reviews
router.get(
    "/",
    ReviewController.getAllReviews
);

// Get reviews of a specific product
router.get(
    "/product/:productId",
    ReviewController.getProductReviews
);

// Get single review
router.get(
    "/:id",
    ReviewController.getSingleReview
);


// ==============================
// Admin Routes
// ==============================

// Admin delete review
router.delete(
    "/admin/:id",
    auth(Role.ADMIN),
    ReviewController.adminDeleteReview
);

// ==============================
// Super Admin Routes
// ==============================

// Super  Admin delete review
router.delete(
    "/super-admin/:id",
    auth(Role.SUPER_ADMIN),
    ReviewController.superAdminDeleteReview
);

export const ReviewRoutes = router;

