export const protect = (req, res, next) => {
    console.log("Middleware de protection appelé.");
    next();
};