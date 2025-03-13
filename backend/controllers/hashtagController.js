import Hashtag from "../models/Hashtag.js";

// 📌 Récupérer tous les hashtags ou filtrer par catégorie
export const getHashtags = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const hashtags = await Hashtag.find(filter).sort({ tweetCount: -1 });
    
    res.json(hashtags);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des hashtags:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📌 Ajouter un nouveau hashtag
export const createHashtag = async (req, res) => {
  try {
    const { hashtag, category } = req.body;

    if (!hashtag || !category) {
      return res.status(400).json({ message: "Hashtag et catégorie sont requis" });
    }

    const existingHashtag = await Hashtag.findOne({ hashtag });
    if (existingHashtag) {
      return res.status(400).json({ message: "Ce hashtag existe déjà" });
    }

    const newHashtag = new Hashtag({ hashtag, category });
    await newHashtag.save();
    
    res.status(201).json(newHashtag);
  } catch (error) {
    console.error("❌ Erreur lors de la création du hashtag:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ➕ Ajouter plusieurs hashtags d'un coup
export const createMultipleHashtags = async (req, res) => {
    try {
        const hashtags = req.body; // 📌 On attend un tableau ici

        if (!Array.isArray(hashtags) || hashtags.length === 0) {
            return res.status(400).json({ message: "Un tableau de hashtags est requis" });
        }

        // Vérifier que chaque hashtag a bien les champs requis
        const validHashtags = hashtags.filter(ht => ht.hashtag && ht.category);

        if (validHashtags.length !== hashtags.length) {
            return res.status(400).json({ message: "Certains hashtags sont invalides (manque hashtag ou category)" });
        }

        // Insérer en masse les hashtags valides
        const newHashtags = await Hashtag.insertMany(validHashtags);
        
        res.status(201).json({ message: "Hashtags ajoutés avec succès", newHashtags });
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion des hashtags:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getHashtagFeed = async (req, res) => {
  try {
    const { name } = req.params;
    const hashtagName = name.startsWith('#') ? name : `#${name}`;

    // Récupérer tous les tweets contenant ce hashtag
    const tweets = await Tweet.findAll({
      where: {
        // Utiliser LIKE pour trouver le hashtag dans le contenu
        content: {
          [Op.like]: `%${hashtagName}%`
        }
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePic']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Si c'est une requête API
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        tweets,
        hashtagName
      });
    }

    // Sinon, renvoyer la page HTML
    return res.render('hashtagFeed', {
      tweets,
      hashtagName,
      title: `Tweets avec ${hashtagName}`
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tweets par hashtag:', error);
    return res.status(500).json({
      success: false,
      message: "Une erreur s'est produite lors de la récupération des tweets",
      error: error.message
    });
  }
};


