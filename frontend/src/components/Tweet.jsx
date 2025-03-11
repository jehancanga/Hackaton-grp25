

const Tweet = ({ tweet }) => (
  <div className="tweet">
    <h3>{tweet.author}</h3>
    <p>{tweet.content}</p>
    <div className="interactions">
      <span>Likes: {tweet.likes}</span>
      <span>Retweets: {tweet.retweets}</span>
      <span>Comments: {tweet.comments}</span>
    </div>
  </div>
);

export default Tweet;