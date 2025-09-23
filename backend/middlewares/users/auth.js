export const checkUserLogin=(req,res,next)=>{  
    if(req.isAuthenticated()){
  
      if(req.user.role==="user"){
          next()
        }else{
          res.status(403).json({
            success: false,
            message: "notAuthorized"
          });
        }
      } else{
        res.status(401).json({
          success: false,
          message: "notAuthenticated"
        });
      }
  }
  
  