import { useEffect, useState } from 'react';
import Tweet from './Tweet';
import HashtagsSection from './HashtagsSection';
import PopularTweets from './PopularTweets';
import SearchBar from './Searchbar';// Importez le composant SearchBar
import TrendingTopics from './TrendingTopics';
import FollowSuggestions from './FollowSuggestions';
import TweetEditor from './TweetEditor';
import VideoRecorder from './VideoRecorder';
import ToggleButton from './Buttons/ToggleButtton';
import mockTweets from './data/mockTweets';
import mockSuggestions from './data/mockSuggestion';
import './Feed.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importer Bootstrap CSS

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [popularTweets, setPopularTweets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [followSuggestions, setFollowSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState('date'); // État pour le tri


  // Charger les données mockées
  useEffect(() => {
    setTweets(mockTweets);
    setFilteredTweets(mockTweets);

    // Extraire les hashtags uniques
    const allHashtags = mockTweets.flatMap(tweet => tweet.hashtags);
    const uniqueHashtags = [...new Set(allHashtags)];
    setHashtags(uniqueHashtags);

    // Trier les tweets par popularité
    const sortedPopularTweets = mockTweets.sort(
      (a, b) => (b.likes + b.retweets + b.comments) - (a.likes + a.retweets + a.comments)
    );
    setPopularTweets(sortedPopularTweets);

    // Calculer les Trending Topics
    const hashtagCounts = {};
    mockTweets.forEach(tweet => {
      tweet.hashtags.forEach(hashtag => {
        if (hashtagCounts[hashtag]) {
          hashtagCounts[hashtag]++;
        } else {
          hashtagCounts[hashtag] = 1;
        }
      });
    });

    const trending = Object.keys(hashtagCounts)
      .map(hashtag => ({
        name: hashtag,
        count: hashtagCounts[hashtag],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTrendingTopics(trending);

    // Charger les suggestions de comptes à suivre
    
    setFollowSuggestions(mockSuggestions);
  }, []);

  // Fonction pour gérer l'action "Suivre"
  const handleFollow = (userId) => {
    console.log(`Suivre l'utilisateur avec l'ID : ${userId}`);
  };

  // Fonction pour filtrer les tweets en fonction de la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = tweets.filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(query.toLowerCase()) || // Recherche dans le contenu
        tweet.author.toLowerCase().includes(query.toLowerCase()) || // Recherche par auteur
        tweet.hashtags.some((hashtag) =>
          hashtag.toLowerCase().includes(query.toLowerCase()) // Recherche par hashtag
        )
    );
    setFilteredTweets(filtered);
  };

  // Fonction pour trier les tweets par date ou popularité
  const handleSort = (criteria) => {
    setSortBy(criteria);
    let sortedTweets = [...filteredTweets];

    if (criteria === 'date') {
      sortedTweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Du plus récent au plus ancien
    } else if (criteria === 'popularity') {
      sortedTweets.sort((a, b) => (b.likes + b.retweets + b.comments) - (a.likes + a.retweets + a.comments)); // Par popularité
    }

    setFilteredTweets(sortedTweets);
  };

  return (
    <div className="container mt-4 feed-container">
    {/* Colonne de gauche */}
    <div className="feed-section">
      <HashtagsSection hashtags={hashtags} />
      <ToggleButton label="Éditeur de Tweet">
        <TweetEditor />
      </ToggleButton>
      <ToggleButton label="Studio d'enregistrement">
        <VideoRecorder />
      </ToggleButton>
    </div>
  
    {/* Colonne centrale (le feed principal) */}
    <div className="feed-section">
      <SearchBar searchQuery={searchQuery} onSearchChange={handleSearch} />
      <div className="mb-3">
        <button className={`btn ${sortBy === 'date' ? 'btn-primary' : 'btn-outline-primary'} me-2`} onClick={() => handleSort('date')}>
          Trier par date
        </button>
        <button className={`btn ${sortBy === 'popularity' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleSort('popularity')}>
          Trier par popularité
        </button>
      </div>
      {filteredTweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  
    {/* Colonne de droite */}
    <div className="feed-section">
      <TrendingTopics topics={trendingTopics} />
      <FollowSuggestions suggestions={followSuggestions} onFollow={handleFollow} />
      <PopularTweets tweets={popularTweets} />
    </div>
  </div>
  
  );
};

export default Feed;