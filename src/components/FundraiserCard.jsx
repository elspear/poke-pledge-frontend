import { Link } from "react-router-dom";
import "./FundraiserCard.css";

function FundraiserCard(props) {
  const { fundraiserData } = props;
  const fundraiserLink = `fundraiser/${fundraiserData.id}`;

  return (
    <div className="fundraiser-card">
      <Link to={fundraiserLink} className="fundraiser-link">
        <img src={fundraiserData.image} />
        <h3>{fundraiserData.title}</h3>
      </Link>
      <div className="fundraiser-owner">
        <span>By </span>
        <Link 
          to={`/profile/${fundraiserData.owner?.id || fundraiserData.owner}`} 
          className="owner-link"
        >
          {fundraiserData.owner_username || 'Unknown'}
        </Link>
      </div>
    </div>
  );
}

export default FundraiserCard;