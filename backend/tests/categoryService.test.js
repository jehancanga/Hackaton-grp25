const { categorizeTweet, extractHashtags } = require('../services/categoryService');

// Tester l'extraction des hashtags
console.log("Test d'extraction des hashtags:");
console.log(extractHashtags("J'adore #javascript et #react pour le #développement"));

// Tester la catégorisation
console.log("\nTest de catégorisation des tweets:");
const tweets = [
  "Je code un nouveau projet en JavaScript avec React #programming",
  "J'ai regardé un nouveau film d'action au cinéma hier #movie",
  "Les nouvelles politiques environnementales sont importantes #environment",
  "Un tweet sans catégorie évidente"
];

tweets.forEach(tweet => {
  const hashtags = extractHashtags(tweet);
  const category = categorizeTweet(tweet, hashtags);
  console.log(`Tweet: "${tweet}"\nCatégorie: ${category}\n`);
});