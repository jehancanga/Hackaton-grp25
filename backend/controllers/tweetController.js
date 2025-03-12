import Tweet from "../models/Tweet.js";

// 📝 Créer un tweet
export const createTweet = async (req, res) => {
    try {
        const { content, media } = req.body;
        const tweet = await Tweet.create({ userId: req.user.id, content, media });
        res.status(201).json(tweet);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Obtenir tous les tweets
export const getTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().populate("userId", "username profilePic").sort({ createdAt: -1 });
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 📌 Obtenir les tweets d'un utilisateur spécifique
export const getUserTweets = async (req, res) => {
    try {
        const { id } = req.params;
        const tweets = await Tweet.find({ userId: id })
            .populate("userId", "username profilePic")
            .sort({ createdAt: -1 });

        if (!tweets.length) {
            return res.status(404).json({ message: "Aucun tweet trouvé pour cet utilisateur" });
        }

        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// ❤️ Liker un tweet
export const likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        if (tweet.likes.includes(req.user.id)) {
            tweet.likes = tweet.likes.filter(id => id.toString() !== req.user.id);
        } else {
            tweet.likes.push(req.user.id);
        }

        await tweet.save();
        res.json(tweet);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔄 Retweeter un tweet
export const retweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        tweet.retweets.push(req.user.id);
        await tweet.save();
        res.json(tweet);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ❌ Supprimer un tweet
export const deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet) return res.status(404).json({ message: "Tweet non trouvé" });

        if (tweet.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Action non autorisée" });
        }

        await tweet.deleteOne();
        res.json({ message: "Tweet supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
