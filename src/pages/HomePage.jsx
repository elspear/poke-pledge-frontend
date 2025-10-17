import useFundraisers from "../hooks/use-fundraisers";
import FundraiserCard from "../components/FundraiserCard";
import "./HomePage.css";

function HomePage() {
  const { fundraisers, isLoading, error } = useFundraisers();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error loading fundraisers: {error.message || String(error)}</div>;
  }

  return (
    <div id="fundraiser-list">
      {fundraisers.map((fundraiserData, key) => (
        <FundraiserCard key={key} fundraiserData={fundraiserData} />
      ))}
    </div>
  );
}

export default HomePage;