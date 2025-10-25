import { useParams } from "react-router-dom";
import { useState } from "react";
import PledgeForm from "../components/PledgeForm";
import useFundraiser from "../hooks/use-fundraiser";
import { useAuth } from "../hooks/use-auth";
import './FundraiserPage.css';

function FundraiserPage() {
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  // here we use a hook that comes for free in React called `useParams` to get the id from the url so we can pass it to our useFundraiser hook
  const { id } = useParams();

  // useFundraiser returns 3 pieces of info, so we need to grab them here
  const { fundraiser, isLoading, error, refetch } = useFundraiser(id);
  const { auth } = useAuth();

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (!fundraiser) {
    return <p>Fundraiser not found.</p>;
  }
  

  // Now it's safe to access fundraiser owner fields. Be defensive because
  // different API responses may include owner as an id, a nested object, or
  // separate username fields. Prefer numeric id when possible, otherwise use
  // username to build the profile route.
  const ownerIdRaw = fundraiser.owner ?? fundraiser.owner_id ?? null;
  const ownerId = typeof ownerIdRaw === "number" ? ownerIdRaw : (ownerIdRaw && typeof ownerIdRaw.id === "number" ? ownerIdRaw.id : null);
  const ownerUsername = fundraiser.owner_username || fundraiser.owner?.username || fundraiser.owner?.user?.username || fundraiser.owner_name || null;

  const isOwner = auth.user && (auth.user.username === ownerUsername || auth.user.id === ownerId);
  const ownerLabel = ownerUsername || (ownerId ? String(ownerId) : "user");

  return (
    <div className="fundraiser-page-container">
        <div className="fundraiser-title">
            <h1>{fundraiser.title}</h1>
        </div>
        <div style={{ margin: '6px 0' }} className="owner-badge">
          <strong>Owner:</strong>{" "}
          <span>{ownerLabel}</span>
          <span style={{ marginLeft: 8, color: '#666', fontSize: 12 }}>(id: {ownerId ?? 'n/a'})</span>
        </div>
        <div className="fundraiser-image">
             <img
        src={fundraiser.image}
        alt={fundraiser.title}
      />

        </div>
      
      <p>{fundraiser.description}</p>
      <p>
        Created at: {new Date(fundraiser.date_created).toLocaleDateString()}
      </p>
      {fundraiser.end_date && (
        <p>
          Ends at: {new Date(fundraiser.end_date).toLocaleString()}
        </p>
      )}
      <h3>Status: {fundraiser.is_open ? "Open" : "Closed"}</h3>
      {/* Only show the Pledge button to users who are not the fundraiser owner */}
      {!isOwner && !showPledgeForm && (
        <button onClick={() => setShowPledgeForm(true)}>Pledge</button>
      )}

      {/* If the current user is the owner, show a short note instead of the pledge button */}
      {isOwner && (
        <p style={{ color: '#4a5568', fontStyle: 'italic' }}>You are the owner of this fundraiser. You cannot pledge to your own fundraiser.</p>
      )}

      {showPledgeForm && <PledgeForm fundraiserId={fundraiser.id} onSuccess={refetch} />}
      <div className="progress-bar-container">
      <p>
  Progress: ${fundraiser.progress} raised of ${fundraiser.goal} goal
  ({fundraiser.progress_percentage}%)
</p>

<progress className="fundraiser-progress-bar" value={fundraiser.progress} max={fundraiser.goal}></progress>
</div>
      {isOwner && (
        <Link to={`/fundraiser/${fundraiser.id}/edit`}>
          <button>Edit Fundraiser</button>
        </Link>
      )}
      <h3>Pledges:</h3>
      <ul>
        {fundraiser.pledges.map((pledgeData, key) => (
          <li key={key}>
            {pledgeData.amount} from {pledgeData.supporter_username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FundraiserPage;
