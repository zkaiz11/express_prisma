const ROLE = require("../config/roleList")

// const verifyRole = (...allowedRoles) => {
//     return (req, res, next) => {
//         if (!req?.roles) return res.sendStatus(401);
//         const rolesArray = [...allowedRoles];
//         const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
//         if (!result) return res.sendStatus(401);
//         next();
//     }
// }

const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.user?.role) return res.sendStatus(401);
        if (req.user.role != ROLE[allowedRole]) return res.sendStatus(401);
        next()
    }
}

module.exports = verifyRole