import express from 'express';
import { 
    registerController,
    loginController, 
    testController,
    forgotPasswordController,
    updateProfileController
} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
//router object
const authRoute = express.Router();

//routing
//REGISTER || METHOD POST
authRoute.post("/register", registerController);

//LOGIN || POST
authRoute.post("/login", loginController);

//Forgot Password
authRoute.post("/forgot-password", forgotPasswordController);

//test routes
authRoute.get("/test", requireSignIn, isAdmin, testController);

//protected user auth route
authRoute.get("/user-auth", requireSignIn, (req, res)=> {
    res.status(200).send({ok: true});
});

//protected admin auth route
authRoute.get("/admin-auth", requireSignIn, isAdmin, (req, res)=> {
    res.status(200).send({ok: true});
});

// Update Profile
authRoute.put('/profile', requireSignIn, updateProfileController)
export default authRoute;