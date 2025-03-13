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
        
        // Important : repopuler l'utilisateur avant de renvoyer la réponse
        const populatedTweet = await Tweet.findById(tweet._id)
            .populate("userId", "username profilePic");
        
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

        await tweet.deleteOne();
        res.json({ message: "Tweet supprimé" });
    } catch (error) {
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
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post non trouvé" });
  
        post.retweets = post.retweets.filter(id => id.toString() !== req.user.id);
        await post.save();
        
        // Repopuler l'utilisateur avant de retourner
        const populatedPost = await Post.findById(post._id)
            .populate("userId", "username profilePic");
        
        res.json(populatedPost);
    } catch (error) {
        console.error("Erreur annulation retweet:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
  };
  