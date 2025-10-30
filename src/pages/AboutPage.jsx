import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-header">
                <h1>ABOUT POKÉPLEDGE</h1>
            </div>
            
            <div className="about-content">
                <section className="mission">
                    <h2>Our Mission</h2>
                    <p>
                        PokéPledge brings together Pokémon trainers and supporters to help 
                        injured, abandoned, or struggling Pokémon find their way back to health 
                        and happiness. We believe every Pokémon deserves a chance to thrive.
                    </p>
                </section>

                <section className="how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <h3>Create</h3>
                            <p>Trainers create fundraisers for Pokémon in need, detailing their story and required items.</p>
                        </div>
                        <div className="step">
                            <h3>Support</h3>
                            <p>Fellow trainers and Pokémon enthusiasts contribute to fundraisers by pledging items or support.</p>
                        </div>
                        <div className="step">
                            <h3>Heal</h3>
                            <p>Together, we help Pokémon recover and find their path to a better life.</p>
                        </div>
                    </div>
                </section>

                <section className="join-community">
                    <h2>Join Our Community</h2>
                    <p>
                        Whether you're a trainer looking to help a Pokémon in need or a supporter 
                        wanting to make a difference, PokéPledge is your platform to create positive 
                        change in the Pokémon world.
                    </p>
                    <button className="start-fundraiser-button">Start a Fundraiser</button>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;