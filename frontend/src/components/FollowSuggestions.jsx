
const FollowSuggestions = ({ suggestions, onFollow }) => {
  return (
    <div className="follow-suggestions">
      <h3>Suggestions de comptes à suivre</h3>
      <ul>
        {suggestions.map((user) => (
          <li key={user.id}>
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="bio">{user.bio}</span>
            </div>
            <button onClick={() => onFollow(user.id)}>Suivre</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowSuggestions;