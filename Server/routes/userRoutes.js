import express from "express";
import { userRegistration, userLogin, changeUserPasssword, LoggedUser, userResetPassword, passwordResetlink} from "../controllers/UserController.js"; // Import controller for LoggedUser
import checkUserAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", userRegistration);
router.post("/Login", userLogin);
router.post('/ResetPassword', userResetPassword)
router.post('/UserResetPassword/:id/:token', passwordResetlink)


// Protected routes
router.use("/LoggedUser", checkUserAuth); // Apply middleware
router.get("/LoggedUser", LoggedUser); // Define GET route for /LoggedUser

router.use("/Change", checkUserAuth); // Apply middleware
router.post("/Change", changeUserPasssword);

export default router;
