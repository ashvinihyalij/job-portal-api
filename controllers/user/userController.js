import asyncHandler from "express-async-handler";
import {
    handleValidationError,
    handleSuccessResponse,
    handleErrorResponse
} from "../../utils/apiResponse.js";

/**
 * @route GET v1/user/profile
 * @url http://localhost:8080/api/v1/user/profile
 * @desc gets logged in user's profile
 * @access Private
 */
export const getProfile = asyncHandler(async (req, res, next) => {
    try {
        const { password, ...userData } = req.user._doc;    
        return handleSuccessResponse(
            res,
            "User profile fetched successfully.",            
            [userData]
        );
        } catch (error) {
            logger.error(`Error in getProfile: ${error}`);
            handleErrorResponse(
                res,
                "Internal Server Error"
            );
        }
});