import { useParams, Link } from "react-router-dom";
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
  const { fundraiser, isLoading, error } = useFundraiser(id);
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

  // Now it's safe to access fundraiser.owner_username
  const isOwner = auth.user && auth.user.username === fundraiser.owner_username;

  console.log("auth.user:", auth.user);
  console.log("fundraiser.owner_username:", fundraiser.owner_username);
  console.log("isOwner:", isOwner);
  console.log("fundraiser object:", fundraiser);
  console.log("fundraiser.end_date:", fundraiser.end_date);

  return (
    <div className="fundraiser-page-container">
        <div className="fundraiser-title">
            <h1>{fundraiser.title}</h1>
        </div>
        <div className="fundraiser-image">
             <img
        src={fundraiser.image}
        alt={fundraiser.title}
      />

        </div>
      <p>Owner: {fundraiser.owner_username}</p>
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
      {!showPledgeForm && (
        <button onClick={() => setShowPledgeForm(true)}>Pledge</button>
      )}
  {showPledgeForm && <PledgeForm fundraiserId={fundraiser.id} />}
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
