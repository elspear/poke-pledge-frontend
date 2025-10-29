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
    <div onClick={handleCardClick} className="fundraiser-card">
      <div className="fundraiser-title-section">
        <h3>{fundraiserData.title}</h3>
      </div>

      <div className="fundraiser-header">
        <div className="fundraiser-image">
          <img src={fundraiserData.image} alt={fundraiserData.title} />
        </div>
      </div>

      <div className="fundraiser-description">
        {fundraiserData.description?.length > 100 
          ? `${fundraiserData.description.substring(0, 100)}...` 
          : fundraiserData.description}
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

    </div>
  );
}

export default FundraiserCard;