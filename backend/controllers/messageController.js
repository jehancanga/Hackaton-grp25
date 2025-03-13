import Message from "../models/Message.js";

// ✉️ Envoyer un message privé
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const message = await Message.create({
            senderId: req.user.id,
            receiverId,
            content
        }); 

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📜 Obtenir tous les messages d'une conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: req.user.id, receiverId: conversationId },
                { senderId: conversationId, receiverId: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Marquer un message comme lu
export const markAsRead = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) return res.status(404).json({ message: "Message non trouvé" });

        if (message.receiverId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Accès interdit" });
        }

        message.seen = true;
        await message.save();
        res.json({ message: "Message marqué comme lu" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
