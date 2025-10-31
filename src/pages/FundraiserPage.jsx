import { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";
import { useAuth } from "../hooks/use-auth";
import PledgeForm from '../components/PledgeForm';
import './FundraiserPage.css';

// Loading and error components
const LoadingState = () => (
  <div className="page-container">
    <div className="loading-container">
      <p>loading...</p>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="page-container">
    <div className="error-container">
      <h2>Error Loading Fundraiser</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="page-container">
    <div className="error-container">
      <h2>Fundraiser Not Found</h2>
      <p>The fundraiser you're looking for could not be found.</p>
    </div>
  </div>
);

// Function to format date
function formatDate(dateString) {
  if (!dateString) return "Not available";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function FundraiserPage() {
  const { id } = useParams();
  const { fundraiser, isLoading, error, refetch } = useFundraiser(id);
  const { auth } = useAuth();
  const [isPledgesExpanded, setIsPledgesExpanded] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const handlePledgeClick = () => {
    setShowPledgeForm(true);
    setShowDetails(false);
  };

  const handlePledgeClose = () => {
    setShowPledgeForm(false);
    setShowDetails(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  if (!fundraiser) {
    return <NotFoundState />;
  }

  // Safely extract owner information with fallbacks
  const ownerIdRaw = fundraiser?.owner ?? fundraiser?.owner_id ?? null;
  const ownerId = typeof ownerIdRaw === "number" ? ownerIdRaw : (ownerIdRaw && typeof ownerIdRaw.id === "number" ? ownerIdRaw.id : null);
  const ownerUsername = fundraiser?.owner_username || fundraiser?.owner?.username || fundraiser?.owner?.user?.username || fundraiser?.owner_name || null;

  const isOwner = auth?.user && (auth.user.username === ownerUsername || auth.user.id === ownerId);
  const ownerLabel = ownerUsername || (ownerId ? String(ownerId) : "user");

  return (
    <div className="page-container">
      <div className="fundraiser-container">
          {/* Left Card */}
          <div className="left-card">
            <header className="fundraiser-header">
              <h1 className="fundraiser-title">{fundraiser.title}</h1>
              {isOwner && (
                <Link to={`/fundraiser/${fundraiser.id}/edit`}>
                  <button className="edit-button">EDIT</button>
                </Link>
              )}
            </header>

            <div className="image-container">
              <img src={fundraiser.image} alt={fundraiser.title} />
            </div>

            <div className="description-container">
              <p>{fundraiser?.description || 'No description available.'}</p>
            </div>

            <div className="owner-info">
              <p>Created by: <span className="owner-name">{ownerUsername}</span></p>
              <p>Created: <span>{formatDate(fundraiser.date_created)}</span></p>
              <p>Role: <span>{fundraiser.owner?.role ? fundraiser.owner.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Trainer'}</span></p>
              <p>Location: <span>{fundraiser.owner?.location || 'Location not specified'}</span></p>
            </div>

            
          </div>

          {/* Right Card */}
          <div className="right-card">
            <div className={`right-card-header ${!showDetails ? 'collapsed' : ''}`}>
              <h2 className="fundraiser-details">FUNDRAISER DETAILS</h2>
            </div>
            <div className={`metadata-container ${!showDetails ? 'collapsed' : ''}`}>
              <div className="metadata-item">
                <span className="metadata-label">Status:</span>
                <span className={`metadata-value status ${fundraiser.is_open ? 'open' : 'closed'}`}>
                  {fundraiser.is_open ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Pokemon:</span>
                <span className="metadata-value">{fundraiser.pokemon}</span>
              </div>
              {fundraiser.items_needed && (
                <div className="metadata-item">
                  <span className="metadata-label">Items Needed:</span>
                  <span className="metadata-value">{fundraiser.items_needed}</span>
                </div>
              )}
              {fundraiser.end_date && (
                <div className="metadata-item">
                  <span className="metadata-label">End Date:</span>
                  <span className="metadata-value">{formatDate(fundraiser.end_date)}</span>
                </div>
              )}
            </div>
            
            <div className="progress-stats">
              <div className="progress-header">
                <h3 className="progress-title">PROGRESS</h3>
              </div>
              <p className="progress-amount">
                ${fundraiser?.progress || 0} raised of ${fundraiser?.goal || 0} goal
              </p>
              <p className="progress-percentage">
                {fundraiser?.progress_percentage || 0}% Complete
              </p>
              <progress 
                className="progress-bar" 
                value={fundraiser?.progress || 0} 
                max={fundraiser?.goal || 100}
                aria-label="Fundraising progress"
              />
              <div className="pledge-section">
                {!isOwner && (
                  showPledgeForm ? (
                    <PledgeForm 
                      fundraiserId={fundraiser.id}
                      onClose={handlePledgeClose}
                    />
                  ) : (
                    <button 
                      className="pledge-button"
                      onClick={handlePledgeClick}
                      aria-label="Make a pledge"
                    >
                      PLEDGE
                    </button>
                  )
                )}
                {isOwner && (
                  <p className="owner-note" role="alert">You cannot pledge to your own fundraiser</p>
                )}
              </div>
            </div>

            <div className="pledges-header" onClick={() => setIsPledgesExpanded(!isPledgesExpanded)} style={{ cursor: 'pointer' }}>
              <h3 className="pledges-title">PLEDGES ({fundraiser?.pledges?.length || 0})</h3>
              <span className="expand-icon">{isPledgesExpanded ? '▼' : '▶'}</span>
            </div>
            <div className={`pledges-container ${isPledgesExpanded ? 'expanded' : ''}`}>
              <div className="pledges-list">
                {(fundraiser?.pledges || []).map((pledgeData, key) => (
                  <div key={key} className="pledge-item">
                    <span className="pledge-amount">${pledgeData.amount}</span>
                    <span className="pledge-supporter">{pledgeData.supporter_username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default FundraiserPage;
