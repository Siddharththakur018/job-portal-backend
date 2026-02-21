const User = require("../model/authModel");

exports.isAuthenticated = async(req,res,next) => {
    try {
        if(!req.session.userId){
            return res.status(401).json({message: "Not authenticated!"})
        }

        const user = await User.findById(req.session.userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found!"});
        }

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};