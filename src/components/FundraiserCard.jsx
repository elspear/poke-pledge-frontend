import { Link, useNavigate } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  const navigate = useNavigate();
  const fundraiserLink = `fundraiser/${fundraiserData.id}`;
  
  const handleCardClick = () => {
    navigate(fundraiserLink);
  };

  const handleOwnerClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking owner link
  };
  
  return (
    <div onClick={handleCardClick} className="fundraiser-card clickable">
      <div className="fundraiser-title-section">
        <h3>{fundraiserData.title}</h3>
      </div>
      
      <div className="fundraiser-top-section">
        <div className="fundraiser-image">
          <img src={fundraiserData.image} alt={fundraiserData.title} />
        </div>
        <div className="fundraiser-right">
          <p className="fundraiser-description">
            {fundraiserData.description?.length > 100 
              ? `${fundraiserData.description.substring(0, 100)}...` 
              : fundraiserData.description}
          </p>
        </div>
      </div>
      
      <div className="fundraiser-bottom-section">
        <div className="fundraiser-owner">
          <span>By </span>
          <Link 
            to={`/profile/${fundraiserData.owner?.id || fundraiserData.owner}`} 
            className="owner-link"
            onClick={handleOwnerClick}
          >
            {fundraiserData.owner_username || 'Unknown'}
          </Link>
        </div>
        
        <div className="fundraiser-stats">
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((fundraiserData.progress / fundraiserData.goal) * 100, 100)}%` }}
              />
            </div>
            <p className="progress-text">
              ₽{fundraiserData.progress} raised of ₽{fundraiserData.goal}
            </p>
          </div>
        </div>

        {fundraiserData.items_needed && (
          <div className="items-needed">
            <span>Items needed:</span> {fundraiserData.items_needed}
          </div>
        )}
      </div>
    </div>
  );
}

export default FundraiserCard;