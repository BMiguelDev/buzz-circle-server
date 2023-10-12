const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // If the 'req.roles' property (which needs to be set by the 'verifyJWT' middleware before running the 'verifyRoles' middleware) doesn't exist, return response with 'status' of 401 ("Unauthorized")
        if(!req?.roles) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);  // Compare the user's roles to the list of roles allowed to access the desired resource
        if(!result) return res.sendStatus(401);     // If user doesn't have the needed role, return response with 'status' of 401 ("Unauthorized")

        next();
    }
}

module.exports = verifyRoles;
