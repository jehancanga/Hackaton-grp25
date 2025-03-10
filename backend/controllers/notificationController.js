import Notification from "../models/Notification.js";

// 📜 Obtenir toutes les notifications d'un utilisateur
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .populate("fromUserId", "username profilePic")
            .populate("tweetId", "content")
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Marquer une notification comme lue
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).json({ message: "Notification non trouvée" });

        if (notification.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        notification.read = true;
        await notification.save();
        res.json({ message: "Notification marquée comme lue" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
