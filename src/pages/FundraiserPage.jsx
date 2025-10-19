import { useParams, Link } from "react-router-dom";
import useFundraiser from "../hooks/use-fundraiser";
import { useAuth } from "../hooks/use-auth";

function FundraiserPage() {
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

  return (
    <div>
      <h2>{fundraiser.title}</h2>
      <img
        src={fundraiser.image}
        alt={fundraiser.title}
        style={{ maxWidth: "300px" }}
      />
      <p>Owner: {fundraiser.owner_username}</p>
      <p>{fundraiser.description}</p>
      <p>
        Created at: {new Date(fundraiser.date_created).toLocaleDateString()}
      </p>
      <h3>Status: {fundraiser.is_open ? "Open" : "Closed"}</h3>
      {isOwner && (
        <Link to={`/fundraiser/${fundraiser.id}/edit`}>
          <button>Edit Fundraiser</button>
        </Link>
      )}
      <h3>Pledges:</h3>
      <ul>
        {fundraiser.pledges.map((pledgeData, key) => (
          <li key={key}>
            {pledgeData.amount} from {pledgeData.supporter}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FundraiserPage;
