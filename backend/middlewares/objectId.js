// To check if it is a valid mongoose object Id
import mongoose from "mongoose";


export function validateObjectId(req,res,next) {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(400).json({
            error:"Invalid ObjectId format"
        });
    }
    next();
}