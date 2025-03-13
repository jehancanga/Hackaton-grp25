import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import Hashtag from "../models/Hashtag.js";
import pkg from 'sequelize';
const { Op } = pkg;

export const search = async (req, res) => {
  try {
    const { q, type, dateFilter, sortByPopularity } = req.query;

    // Vérifier si la requête est valide
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "La requête de recherche doit contenir au moins 2 caractères"
      });
    }

    const results = {};
    const searchTerm = `%${q}%`;

    // Préparer la condition de date
    let dateCondition = {};
    if (dateFilter) {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }

      if (startDate) {
        dateCondition = {
          createdAt: {
            [Op.gte]: startDate
          }
        };
      }
    }

    // Recherche de tweets
    if (!type || type === 'all' || type === 'tweets') {
      let tweetOrder = [['createdAt', 'DESC']];
      if (sortByPopularity === 'true') {
        tweetOrder = [['likes', 'DESC'], ['createdAt', 'DESC']];
      }

      const tweets = await Tweet.findAll({
        where: {
          [Op.or]: [
            { content: { [Op.like]: searchTerm } },
            { '$User.username$': { [Op.like]: searchTerm } }
          ],
          ...dateCondition
        },
        include: [
          {
            model: User,
            attributes: ['username', 'profilePic']
          }
        ],
        order: tweetOrder,
        limit: 30
      });

      results.tweets = tweets.map(tweet => ({
        id: tweet.id,
        content: tweet.content,
        author: tweet.User.username,
        profilePic: tweet.User.profilePic,
        createdAt: tweet.createdAt,
        likes: tweet.likes || 0,
        replies: tweet.replies || 0
      }));
    }

    // Recherche d'utilisateurs
    if (!type || type === 'all' || type === 'users') {
      let userOrder = [['username', 'ASC']];
      if (sortByPopularity === 'true') {
        userOrder = [['followers', 'DESC'], ['username', 'ASC']];
      }

      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: searchTerm } },
            { name: { [Op.like]: searchTerm } },
            { bio: { [Op.like]: searchTerm } }
          ]
        },
        attributes: ['id', 'username', 'name', 'profilePic', 'bio', 'followers', 'following'],
        order: userOrder,
        limit: 20
      });

      results.users = users;
    }

    // Recherche de hashtags
    if (!type || type === 'all' || type === 'hashtags') {
      let hashtagOrder = [['count', 'DESC']];
      
      // Recherche avec ou sans le symbole #
      const cleanQuery = q.startsWith('#') ? q.substring(1) : q;
      
      const hashtags = await Hashtag.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `#${cleanQuery}%` } },
            { name: { [Op.like]: `%#${cleanQuery}%` } }
          ]
        },
        order: hashtagOrder,
        limit: 15
      });

      results.hashtags = hashtags;
    }

    return res.json(results);
  } catch (error) {
    console.error("Erreur de recherche:", error);
    return res.status(500).json({
      success: false,
      message: "Une erreur s'est produite lors de la recherche",
      error: error.message
    });
  }
};
