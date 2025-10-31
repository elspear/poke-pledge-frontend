import { useParams, Link } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";
import { useAuth } from "../hooks/use-auth";
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

function FundraiserPage() {
  const { id } = useParams();
  const { fundraiser, isLoading, error, refetch } = useFundraiser(id);
  const { auth } = useAuth();

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

            <div className="owner-info">
              <p>Created by: <span className="owner-name">{ownerUsername}</span></p>
              <p>Created: <span>{fundraiser?.date_created || 'Not available'}</span></p>
              <p>Last updated: <span>{fundraiser?.date_updated || 'Not available'}</span></p>
            </div>

            <div className="description-container">
              <p>{fundraiser?.description || 'No description available.'}</p>
            </div>
          </div>

          {/* Right Card */}
          <div className="right-card">
            
            <div className="progress-stats">
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
              {!isOwner && (
                <button 
                  className="pledge-button"
                  aria-label="Make a pledge"
                >
                  PLEDGE
                </button>
              )}
              {isOwner && (
                <p className="owner-note" role="alert">You cannot pledge to your own fundraiser</p>
              )}
            </div>

            <div className="pledges-container">
              <h3 className="pledges-title">PLEDGES</h3>
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
