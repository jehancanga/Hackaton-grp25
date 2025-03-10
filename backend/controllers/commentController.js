import Comment from "../models/Comment.js";
import Tweet from "../models/Tweet.js";

// 📝 Ajouter un commentaire à un tweet
export const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const tweet = await Tweet.findById(req.params.tweetId);

        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        const comment = await Comment.create({ tweetId: req.params.tweetId, userId: req.user.id, content });
        tweet.comments.push(comment._id);
        await tweet.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Obtenir tous les commentaires d’un tweet
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ tweetId: req.params.tweetId })
            .populate("userId", "username profilePic")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ❤️ Liker un commentaire
export const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

        if (comment.likes.includes(req.user.id)) {
            comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
        } else {
            comment.likes.push(req.user.id);
        }

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ❌ Supprimer un commentaire (uniquement par l’auteur)
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Action non autorisée" });
        }

        await comment.deleteOne();
        res.json({ message: "Commentaire supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
