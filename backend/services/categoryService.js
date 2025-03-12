import natural from 'natural';
// import stopwords from 'stopwords-en'; // ou 'stopwords-en' si votre application est en anglais

const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'at', 'on', 'in', 'that', 'this', 'it', 'not', 'as', 'from', 'have', 'has', 'had', 'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how'];

// Définition des mots-clés par catégorie
const CATEGORY_KEYWORDS = {
  "Technology": ["tech", "technologie", "ai", "ia", "intelligence artificielle", "programmation", "code", "développement", "logiciel", "app", "application", "internet", "data", "données", "web", "cyber", "réseau", "cloud", "ordinateur", "smartphone", "mobile", "digital", "numérique"],
  "Science": ["science", "recherche", "biologie", "physique", "chimie", "astronomie", "espace", "climat", "neuroscience", "quantique", "laboratoire", "expérience", "découverte", "théorie", "étude"],
  "Sports": ["sport", "football", "basketball", "soccer", "tennis", "baseball", "jeux olympiques", "fitness", "course", "cyclisme", "match", "compétition", "équipe", "joueur", "champion"],
  "Entertainment": ["divertissement", "film", "cinéma", "série", "tv", "télévision", "hollywood", "acteur", "actrice", "célébrité", "musique", "concert", "spectacle", "théâtre"],
  "Politics": ["politique", "gouvernement", "élection", "démocratie", "loi", "parlement", "président", "ministre", "député", "sénat", "vote", "campagne", "parti", "débat"],
  "Health": ["santé", "bien-être", "nutrition", "fitness", "mental", "médecine", "healthcare", "covid", "pandémie", "régime", "exercice", "médecin", "hôpital", "maladie", "traitement"],
  "Education": ["éducation", "apprentissage", "école", "université", "collège", "académique", "étudiant", "enseignement", "connaissance", "étude", "formation", "cours", "diplôme", "professeur"],
  "Business": ["business", "entreprise", "entrepreneuriat", "startup", "marketing", "finance", "investissement", "économie", "leadership", "management", "carrière", "emploi", "travail", "commerce", "marché"],
  "Travel": ["voyage", "tourisme", "aventure", "vacances", "explorer", "destination", "excursion", "hôtel", "avion", "train", "plage", "montagne", "pays", "ville"],
  "Food": ["nourriture", "cuisine", "recette", "restaurant", "chef", "gastronomie", "pâtisserie", "repas", "dîner", "déjeuner", "petit-déjeuner", "végétarien", "vegan", "boisson"],
  "Fashion": ["mode", "style", "vêtements", "design", "modèle", "beauté", "tendance", "luxe", "accessoires", "collection", "designer", "marque", "shopping"],
  "Music": ["musique", "chanson", "artiste", "groupe", "concert", "album", "musicien", "chanteur", "rap", "rock", "pop", "jazz", "festival", "mélodie", "rythme"],
  "Art": ["art", "design", "créatif", "artiste", "dessin", "peinture", "illustration", "photographie", "sculpture", "galerie", "exposition", "musée", "créativité", "oeuvre"],
  "Gaming": ["gaming", "jeu", "jeu vidéo", "esport", "streamer", "playstation", "xbox", "nintendo", "pc", "gamer", "console", "manette", "fps", "rpg", "mmorpg"],
  "Environment": ["environnement", "durabilité", "climat", "écologie", "vert", "renouvelable", "nature", "conservation", "pollution", "recyclage", "planète", "terre", "biodiversité"]
};

// Tokenizer (séparateur de mots)
const tokenizer = new natural.WordTokenizer();

// Fonction pour déterminer la catégorie d'un tweet
export const categorizeTweet = (content, hashtags = []) => {
  // Convertir en minuscules et tokeniser
  const tokens = tokenizer.tokenize(content.toLowerCase());
  
  // Filtrer les stopwords
  const filteredTokens = tokens.filter(token => !stopwords.includes(token));
  
  // Ajouter les hashtags aux tokens
  const allTokens = [...filteredTokens, ...hashtags.map(tag => tag.toLowerCase())];
  
  // Compter les occurrences par catégorie
  const categoryScores = {};
  Object.keys(CATEGORY_KEYWORDS).forEach(category => {
    categoryScores[category] = 0;
    
    // Pour chaque mot/token du tweet
    allTokens.forEach(token => {
      // Si le mot existe dans les mots-clés de la catégorie
      if (CATEGORY_KEYWORDS[category].some(keyword => 
        keyword.includes(token) || token.includes(keyword)
      )) {
        categoryScores[category]++;
      }
    });
  });
  
  // Trouver la catégorie avec le score le plus élevé
  let maxScore = 0;
  let bestCategory = "Uncategorized";
  
  Object.keys(categoryScores).forEach(category => {
    if (categoryScores[category] > maxScore) {
      maxScore = categoryScores[category];
      bestCategory = category;
    }
  });
  
  // Si le score est trop faible, marquer comme non catégorisé
  if (maxScore < 2) {
    return "Uncategorized";
  }
  
  return bestCategory;
};

// Extraction des hashtags du contenu du tweet
export const extractHashtags = (content) => {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  
  if (!matches) return [];
  
  return matches.map(tag => tag.slice(1).toLowerCase());
};