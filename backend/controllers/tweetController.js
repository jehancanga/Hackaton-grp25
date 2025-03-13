import Tweet from "../models/Tweet.js";
import Hashtag from "../models/Hashtag.js";


// 📝 Créer un tweet avec hashtags
export const createTweet = async (req, res) => {
  try {
    const { content, media, hashtags } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Le contenu du tweet est requis" });
    }

    let hashtagIds = [];
    let category = "Autre"; // ✅ Catégorie par défaut

    if (hashtags && Array.isArray(hashtags)) {
      for (const tag of hashtags) {
        let hashtag = await Hashtag.findOne({ hashtag: tag });

        if (!hashtag) {
          hashtag = await Hashtag.create({ hashtag: tag, category: "Autre" });
        }

        hashtagIds.push(hashtag._id);

        // ✅ On récupère la première catégorie trouvée (priorité au premier hashtag)
        if (category === "Autre" && hashtag.category) {
          category = hashtag.category;
        }
      }
    }

    const tweet = await Tweet.create({
      userId: req.user.id,
      content,
      media,
      hashtags: hashtagIds,
      category, // ✅ Ajout de la catégorie
    });

    res.status(201).json({ message: "Tweet créé avec succès", tweet });
  } catch (error) {
    console.error("❌ Erreur lors de la création du tweet :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 Obtenir tous les tweets
export const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("userId", "username profilePic")
      .populate("hashtags", "hashtag category") // 🔥 Ajoute les hashtags
      .sort({ createdAt: -1 });

    res.json(tweets);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tweets :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// 📌 Obtenir les tweets d'un utilisateur spécifique
export const getUserTweets = async (req, res) => {
  try {
    const { id } = req.params;
    const tweets = await Tweet.find({ userId: id })
      .populate("userId", "username profilePic")
      .populate("hashtags", "hashtag category")
      .sort({ createdAt: -1 });

    if (!tweets.length) {
      return res.status(404).json({ message: "Aucun tweet trouvé pour cet utilisateur" });
    }

    res.json(tweets);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tweets utilisateur :", error);
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

    const populatedTweet = await Tweet.findById(tweet._id)
      .populate("userId", "username profilePic")
      .populate("hashtags", "hashtag category");

    res.json(populatedTweet);
  } catch (error) {
    console.error("Erreur like tweet:", error);
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

    // Supprimer le tweet
    await tweet.deleteOne();

    res.json({ message: "Tweet supprimé" });
  } catch (error) {
    console.error("Erreur suppression tweet:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Retweet un tweet
export const retweetTweet = async (req, res) => {
  try {
    const originalTweetId = req.params.id;
    const userId = req.user.id;

    const originalTweet = await Tweet.findById(originalTweetId);
    if (!originalTweet) {
      return res.status(404).json({ message: "Tweet non trouvé" });
    }

    const existingRetweet = await Tweet.findOne({
      isRetweet: true,
      originalTweetId: originalTweetId,
      retweetedBy: userId
    });

    if (existingRetweet) {
      await Tweet.findByIdAndDelete(existingRetweet._id);

      originalTweet.retweets = originalTweet.retweets.filter(
        id => id.toString() !== userId
      );
      await originalTweet.save();

      return res.json({
        message: "Retweet supprimé",
        originalTweet: await Tweet.findById(originalTweetId)
          .populate("userId", "username profilePic")
          .populate("retweets", "username profilePic")
      });
    }

    const retweet = new Tweet({
      content: originalTweet.content,
      userId: originalTweet.userId, // Conserver l'auteur original
      isRetweet: true,
      originalTweetId: originalTweetId,
      retweetedBy: userId,
    });

    await retweet.save();

    if (!originalTweet.retweets.includes(userId)) {
      originalTweet.retweets.push(userId);
      await originalTweet.save();
    }


    const populatedOriginalTweet = await Tweet.findById(originalTweetId)
      .populate("userId", "username profilePic")
      .populate("retweets", "username profilePic");

    const populatedRetweet = await Tweet.findById(retweet._id)
      .populate("userId", "username profilePic")
      .populate("retweetedBy", "username profilePic");

    return res.status(201).json({
      message: "Retweet créé",
      originalTweet: populatedOriginalTweet,
      retweet: populatedRetweet
    });
  } catch (error) {
    console.error("Erreur lors du retweet:", error);
    return res.status(500).json({ message: "Erreur serveur lors du retweet" });
  }
};


// Annuler un retweet
export const unretweetPost = async (req, res) => {
  try {
    const retweet = await Tweet.findOne({
      isRetweet: true,
      originalTweetId: req.params.id,
      retweetedBy: req.user.id
    });

    if (!retweet) {
      return res.status(404).json({ message: "Retweet non trouvé" });
    }

    // Supprimer le retweet
    await retweet.deleteOne();

    // Retirer l'utilisateur de la liste des retweets de l'original
    const originalTweet = await Tweet.findById(req.params.id);
    if (originalTweet) {
      originalTweet.retweets = originalTweet.retweets.filter(id => id.toString() !== req.user.id);
      await originalTweet.save();
    }

    res.json({ message: "Retweet annulé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'annulation du retweet:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 Obtenir la catégorie d'un tweet
export const getTweetCategory = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate("hashtags");

    if (!tweet) {
      return res.status(404).json({ message: "Tweet non trouvé" });
    }

    res.json({ category: tweet.category });
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


