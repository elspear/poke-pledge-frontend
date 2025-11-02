import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./FundraiserCard.css";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  const [imageLoaded, setImageLoaded] = useState(true); // Initialize as true to show image by default
  const navigate = useNavigate();
  const fundraiserLink = `fundraiser/${fundraiserData.id}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount).replace('RUB', '₽');
  };
  
  const handleCardClick = () => {
    navigate(fundraiserLink);
  };

  const handleOwnerClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking owner link
  };
  
  return (
    <div 
      className="fundraiser-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      aria-label={`View fundraiser: ${fundraiserData.title}`}
    >
      <div className="fundraiser-title-section">
        <h3>{fundraiserData.title}</h3>
      </div>

      <div className="fundraiser-card-header">
        <div className="fundraiser-image">
          <img 
            src={fundraiserData.image} 
            alt={fundraiserData.title}
            onError={(e) => {
              e.target.src = '/default-fundraiser-image.png';
              e.target.onerror = null;
            }}
          />
        </div>
      </div>

      <div className="fundraiser-description">
        {fundraiserData.description?.length > 100 
          ? `${fundraiserData.description.substring(0, 100)}...` 
          : fundraiserData.description}
      </div>

      <div className="fundraiser-stats">
        <div className="progress-section">
          <div className="fundraiser-card-progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min((fundraiserData.progress / fundraiserData.goal) * 100, 100)}%` }}
            />
          </div>
          <p className="progress-text">
            {formatCurrency(fundraiserData.progress)} raised of {formatCurrency(fundraiserData.goal)}
          </p>
        </div>

        
      </div>

    </div>
  );
}

export default FundraiserCard;