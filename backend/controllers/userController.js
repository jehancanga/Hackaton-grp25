import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// 📝 Inscription
export const registerUser = async (req, res) => {
    console.log("📢 Route atteinte")
    try {
        console.log("📩 Données reçues pour inscription :", req.body); // Log des données reçues

        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("⚠️ Email déjà utilisé :", email);
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // Créer un nouvel utilisateur
        const user = await User.create({ username, email, password });

        console.log("✅ Utilisateur créé avec succès :", user);
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        console.error("❌ Erreur serveur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// 🔑 Connexion
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        console.log("🔑 Connexion réussie, génération du token...");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔓 Déconnexion
export const logoutUser = async (req, res) => {
    res.json({ message: "Déconnexion réussie !" });
};

// 📌 Obtenir un profil utilisateur
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✏️ Modifier le profil utilisateur (photo de profil, bannière, pseudo, bio, email facultatif)
export const updateUserProfile = async (req, res) => {
    try {
        console.log("📩 Données reçues pour mise à jour du profil :", req.body); // 🔍 Log des données reçues

        const { username, profilePic, bannerPic, bio, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            console.error("❌ Utilisateur non trouvé :", req.user.id);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mise à jour des champs uniquement si ils sont fournis
        if (username) {
            console.log("👤 Mise à jour du username :", username);
            user.username = username;
        }
        if (profilePic) {
            console.log("🖼️ Mise à jour de la photo de profil :", profilePic.substring(0, 100) + "..."); // Afficher seulement une partie si c'est Base64
            user.profilePic = profilePic;
        }
        if (bannerPic) {
            console.log("🎨 Mise à jour de la bannière :", bannerPic);
            user.bannerPic = bannerPic;
        }
        if (bio) {
            console.log("📝 Mise à jour de la bio :", bio);
            user.bio = bio;
        }
        if (email && email !== user.email) {
            console.log("📧 Vérification de l'email :", email);
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                console.warn("⚠️ Email déjà utilisé :", email);
                return res.status(400).json({ message: "Cet email est déjà utilisé par un autre compte." });
            }
            console.log("✅ Mise à jour de l'email :", email);
            user.email = email;
        }

        await user.save();
        console.log("✅ Profil mis à jour avec succès :", user);

        res.json({ message: "Profil mis à jour avec succès", user });
    } catch (error) {
        console.error("❌ Erreur mise à jour profil :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};



// ➕ Suivre un utilisateur
export const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ message: "Déjà suivi" });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
        await currentUser.save();
        await userToFollow.save();

        res.json({ message: "Utilisateur suivi avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ➖ Ne plus suivre un utilisateur
export const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow || !currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ message: "Utilisateur non suivi" });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: "Utilisateur retiré de la liste des suivis" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔄 Réinitialisation du mot de passe
export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const newPassword = crypto.randomBytes(6).toString("hex");
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Mot de passe réinitialisé avec succès", newPassword });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔑 Changer son mot de passe
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Ancien mot de passe incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔍 Rechercher des utilisateurs
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({ username: new RegExp(query, "i") }).select("-password");

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📋 Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 👥 Récupérer les abonnés d'un utilisateur
export const getUserFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("followers", "username profilePic");
        res.json(user.followers);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 👥 Récupérer la liste des abonnements d'un utilisateur
export const getUserFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("following", "username profilePic");
        res.json(user.following);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📛 Bloquer un utilisateur
export const blockUser = async (req, res) => {
    try {
        // Vérification si req.user est défini
        if (!req.user) {
            console.error('Utilisateur non authentifié');
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }


        // Recherche de l'utilisateur à bloquer
        const userToBlock = await User.findById(req.params.id);

        if (!userToBlock) {
            console.error('Utilisateur non trouvé');
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérification si l'utilisateur est déjà bloqué
        const alreadyBlocked = req.user.blockedUsers.includes(req.params.id);
        console.log('Utilisateur déjà bloqué ?', alreadyBlocked);

        if (alreadyBlocked) {
            console.error('Cet utilisateur est déjà bloqué');
            return res.status(400).json({ message: "Cet utilisateur est déjà bloqué" });
        }

        // Bloquer l'utilisateur
        req.user.blockedUsers.push(req.params.id);
        await req.user.save();
        console.log('Utilisateur bloqué avec succès', req.user);

        // Répondre avec un message de succès
        res.json({ message: `Utilisateur ${userToBlock.username} bloqué avec succès` });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};



// 🔓 Débloquer un utilisateur
export const unblockUser = async (req, res) => {
    try {
        if (!req.user) {
            console.error('Utilisateur non authentifié');
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const userToUnblock = await User.findById(req.params.id);

        if (!userToUnblock) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const blockedIndex = req.user.blockedUsers.indexOf(req.params.id);
        if (blockedIndex === -1) {
            return res.status(400).json({ message: "Cet utilisateur n'est pas bloqué" });
        }

        req.user.blockedUsers.splice(blockedIndex, 1);
        await req.user.save();

        res.json({ message: `Utilisateur ${userToUnblock.username} débloqué avec succès` });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
