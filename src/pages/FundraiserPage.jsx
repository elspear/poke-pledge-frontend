import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";
import { useAuth } from "../hooks/use-auth";
import PledgeForm from '../components/PledgeForm';
import PledgeAuthModal from '../components/PledgeAuthModal';
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
  const { auth, isLoggedIn } = useAuth();
  const [isPledgesExpanded, setIsPledgesExpanded] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [localFundraiser, setLocalFundraiser] = useState(null);
  const [showPledgeAuthModal, setShowPledgeAuthModal] = useState(false);

  // Initialize localFundraiser when fundraiser data is loaded
  useEffect(() => {
    if (fundraiser) {
      setLocalFundraiser(fundraiser);
    }
  }, [fundraiser]);

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

  if (!fundraiser && !localFundraiser) {
    return <NotFoundState />;
  }

  // Use localFundraiser if available, otherwise use fundraiser
  const currentFundraiser = localFundraiser || fundraiser;

  // Safely extract owner information with fallbacks
  const ownerIdRaw = currentFundraiser?.owner ?? currentFundraiser?.owner_id ?? null;
  const ownerId = typeof ownerIdRaw === "number" ? ownerIdRaw : (ownerIdRaw && typeof ownerIdRaw.id === "number" ? ownerIdRaw.id : null);
  const ownerUsername = fundraiser?.owner_username || fundraiser?.owner?.username || fundraiser?.owner?.user?.username || fundraiser?.owner_name || null;

  const isOwner = auth?.user && (auth.user.username === ownerUsername || auth.user.id === ownerId);
  const ownerLabel = ownerUsername || (ownerId ? String(ownerId) : "user");

  const handlePledgeSuccess = (newPledge) => {
    // Update local state immediately
    setLocalFundraiser(prev => {
      if (!prev) return null;
      
      const updatedPledges = [...(prev.pledges || []), {
        amount: newPledge.amount,
        supporter_username: auth.user.username,
        anonymous: newPledge.anonymous,
        comment: newPledge.comment,
      }];
      
      const newProgress = (prev.progress || 0) + newPledge.amount;
      const newPercentage = Math.round((newProgress / prev.goal) * 100);
      
      return {
        ...prev,
        pledges: updatedPledges,
        progress: newProgress,
        progress_percentage: newPercentage
      };
    });

    // Close the pledge form
    handlePledgeClose();
  };

  return (
    <div className="page-container">
      <div className="fundraiser-container">
          {/* Left Card */}
          <div className="left-card">
            <div className="top-section">
              <header className="fundraiser-header">
                <h1>
                  <span className="fundraiser-title">{currentFundraiser.title}</span>
                  {isOwner && (
                    <Link to={`/fundraiser/${fundraiser.id}/edit`}>
                      <button className="edit-button">EDIT</button>
                    </Link>
                  )}
                </h1>
              </header>

              <div className="image-container">
                <img src={currentFundraiser.image} alt={currentFundraiser.title} />
              </div>
            </div>

            <div className="owner-info">
              <p>Created by: <Link to={`/profile/${ownerId}`} className="owner-name">{ownerUsername}</Link></p>
              <p>Created: <span>{formatDate(currentFundraiser.date_created)}</span></p>
              <p>Role: <span>{currentFundraiser.owner?.role ? currentFundraiser.owner.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Trainer'}</span></p>
              <p>Location: <span>{currentFundraiser.owner?.location || 'Location not specified'}</span></p>
            </div>

            <div className="description-container">
              <p>{currentFundraiser?.description || 'No description available.'}</p>
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
                <span className={`metadata-value status ${currentFundraiser.is_open ? 'open' : 'closed'}`}>
                  {currentFundraiser.is_open ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Pokemon:</span>
                <span className="metadata-value">{currentFundraiser.pokemon}</span>
              </div>
              {currentFundraiser.items_needed && (
                <div className="metadata-item">
                  <span className="metadata-label">Items Needed:</span>
                  <span className="metadata-value">{currentFundraiser.items_needed}</span>
                </div>
              )}
              {currentFundraiser.end_date && (
                <div className="metadata-item">
                  <span className="metadata-label">End Date:</span>
                  <span className="metadata-value">{formatDate(currentFundraiser.end_date)}</span>
                </div>
              )}
            </div>
            
            <div className="progress-stats">
              <div className="progress-header">
                <h3 className="progress-title">PROGRESS</h3>
              </div>
              <p className="progress-amount">
                ${currentFundraiser?.progress || 0} raised of ${currentFundraiser?.goal || 0} goal
              </p>
              <p className="progress-percentage">
                {currentFundraiser?.progress_percentage || 0}% Complete
              </p>
              <progress 
                className="progress-bar" 
                value={currentFundraiser?.progress || 0} 
                max={currentFundraiser?.goal || 100}
                aria-label="Fundraising progress"
              />
              <div className="pledge-section">
                {!isOwner && (
                  isLoggedIn ? (
                    showPledgeForm ? (
                      <PledgeForm 
                        fundraiserId={currentFundraiser.id}
                        onClose={handlePledgeClose}
                        onSuccess={handlePledgeSuccess}
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
                  ) : (
                    <>
                      <button 
                        className="pledge-button"
                        onClick={() => setShowPledgeAuthModal(true)}
                        aria-label="Make a pledge"
                      >
                        PLEDGE
                      </button>
                      {showPledgeAuthModal && (
                        <PledgeAuthModal 
                          onClose={() => setShowPledgeAuthModal(false)} 
                        />
                      )}
                    </>
                  )
                )}
                {isOwner && (
                  <p className="owner-note" role="alert">You cannot pledge to your own fundraiser</p>
                )}
              </div>
            </div>

            <div className="pledges-header" onClick={() => setIsPledgesExpanded(!isPledgesExpanded)} style={{ cursor: 'pointer' }}>
              <h3 className="pledges-title">PLEDGES ({currentFundraiser?.pledges?.length || 0})</h3>
              <span className="expand-icon">{isPledgesExpanded ? '▼' : '▶'}</span>
            </div>
            <div className={`pledges-container ${isPledgesExpanded ? 'expanded' : ''}`}>
              <div className="pledges-list">
                                {(currentFundraiser?.pledges || []).map((pledgeData, key) => (
                  <div key={key} className="pledge-item">
                    <div className="pledge-main-info">
                      <span className="pledge-supporter">
                        {pledgeData.anonymous ? "Anonymous" : pledgeData.supporter_username}
                      </span>
                      {" donated "}
                      <span className="pledge-amount">${pledgeData.amount}</span>
                    </div>
                    {pledgeData.comment && (
                      <>
                        <span className="pledge-separator">|</span>
                        <div className="pledge-comment">
                          "{pledgeData.comment}"
                        </div>
                      </>
                    )}
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
