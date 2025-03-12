export const protect = async (req, res, next) => {
    console.log("Middleware de protection appelé.");
    console.log("Headers reçus:", JSON.stringify(req.headers));
    
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log("Token extrait:", token ? "Présent" : "Non extrait");
      } else {
        console.log("Format d'autorisation incorrect:", req.headers.authorization);
      }
      
      if (!token) {
        return res.status(401).json({ message: "Accès non autorisé, token manquant" });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token décodé avec succès:", decoded.id);
        
        const user = await User.findById(decoded.id);
        
        if (!user) {
          console.log("Utilisateur non trouvé avec ID:", decoded.id);
          return res.status(401).json({ message: "Utilisateur introuvable" });
        }
        
        console.log("Utilisateur trouvé:", user.username || user._id);
        req.user = user;
        
        next();
      } catch (jwtError) {
        console.error("Erreur JWT:", jwtError.message);
        return res.status(401).json({ message: "Token invalide ou expiré" });
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      res.status(500).json({ message: "Erreur serveur lors de l'authentification" });
    }
  };