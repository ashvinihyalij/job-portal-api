import asyncHandler from "express-async-handler";
import { getUser, getUserById, saveUser } from "../../services/userService.js";
import { getToken, createToken} from "../../services/tokenService.js";

export const requestResetPwd = asyncHandler(async (req, res, next) => {
    const email = req.body.email;
    //validate
    if(!email){
        res.status(400);
        throw new Error("Please provide email");
    }
    const user = await getUser({email});
    if(!user){
        res.status(400);
        throw new Error("User doesn't exist.Please provide correct email.");
    }
    try {
        let token = await getToken({ userId: user._id });

        if (!token) {            
            token = await createToken(user._id);
        }
        const link = `${process.env.BASE_URL}/v1/password-reset/${user._id}/${token.token}`;
        res.status(201).send({
            success: true,
            message: "password reset link sent to your email account",
            user: { "_id": user.id, "token": token.token, "link": link }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Extract error messages from validation errors
            const errorMessages = Object.values(error.errors).map(error => error.message);
            res.status(400);
            throw new Error(errorMessages.join('. '));
        } else {
            // For other types of errors, pass them to the global error handler
            next(error);
        }
    }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { userId, token } = req.params;
    
    //validate
    if(!userId || !token){
        res.status(400);
        throw new Error("Invalid link");
    }

    try {
        //const user = await userModel.findById(req.params.userId);
        let user = await getUserById(req.params.userId); 
        
        if(!user){
            res.status(400);
            throw new Error("invalid link or expired");
        }
        let userToken = await getToken({
            userId: user._id,
            token: req.params.token,
        });
        
        if(!userToken){
            res.status(400);
            throw new Error("invalid link or expired");
        }
        //console.log(req.body.password);
        /*user.password = req.body.password;
        await user.save();*/
        user = await saveUser(user, {password: req.body.password});
        console.log(userToken);
        await userToken.remove();
        /*user.password = req.body.password;
        await user.save();
        await userToken.delete();*/

        res.status(201).send({
            success: true,
            message: "Password set successfully"
            //user: { "_id": user.id, "token": token.token, "link": link }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Extract error messages from validation errors
            const errorMessages = Object.values(error.errors).map(error => error.message);
            res.status(400);
            throw new Error(errorMessages.join('. '));
        } else {
            // For other types of errors, pass them to the global error handler
            next(error);
        }
    }
});