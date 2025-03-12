import jwt from "jsonwebtoken";
import User from "../models/User.js";
 
export const protect = async (req, res, next) => {
    console.log(`Middleware de protection appelé pour : ${req.method} ${req.originalUrl}`);
    console.log("🛠️ Headers reçus :", req.headers);
 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
 
            // Vérification et décodage du token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("🔑 Token décodé :", decoded);
 
            // Récupération de l'utilisateur et stockage dans req.user
            req.user = await User.findById(decoded.id).select("-password");
 
            if (!req.user) {
                return res.status(401).json({ message: "Utilisateur introuvable" });
            }
 
            console.log("✅ Utilisateur trouvé :", req.user);
            next();
        } catch (error) {
            console.error("❌ Erreur de vérification du token :", error);
            res.status(401).json({ message: "Accès non autorisé, token invalide" });
        }
    } else {
        res.status(401).json({ message: "Accès non autorisé, token manquant" });
    }
};