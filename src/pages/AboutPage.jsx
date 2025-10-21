import { useState } from 'react';



const AboutPage = () => {
  return (
    <div className='about-page'>
        <div className='container'>
            <div className='about-title'>
                <h1>About PokePledge</h1>
            </div>
            <p className='about-tagline'>
                PokePledge is a crowdfunding platform where Trainers, Pokemon Centers, and Safari Parks 
                raise PokeDollars (₽) for causes that help Pokemon and their communities.
            </p>
        </div>

        <section className='about-mission'>
            <h2>Our Mission</h2>
            <p>
                Make community care in the Pokemon world fun, transparent and safe.
                Whether it's relocating a sleepy Snorlax, or building enrichment for Growlithe pups, 
                we want stories to be easy to start and simple to support.
            </p>
        </section>

        <section className='about-how'>
            <h2>How PokePledge Works</h2>
            <ul>
                <li>
                    <strong>Create:</strong> Choose your role, tell your story, set a goal, and list any items needed.
                </li>
                <li>
                    <strong>Share:</strong> Write a description, add an image, and publish your fundraiser. Supporters can browse and pledge.
                </li>
                <li>
                    <strong>Deliver:</strong> Track progress, post updates, and close the campaign when you are done.
                </li>
            </ul>
        </section>

        <section className='about-roles'>
            <h2>Who Can Create Fundraisers?</h2>
            <ul>
                <li>
                    <strong>Trainer</strong> personal or team needs (e.g., potions, gear, TMs).
                </li>
                <li>
                    <strong>Pokemon Center Admin</strong> - town/civic welfare (relocations, treatment, equipment).
                </li>
                <li>
                    <strong>Safari Parks</strong> - conservation and wild Pokemon welfare projects.
                </li>
            </ul>
        </section>

        <section className='about-faq'>
            <h2>FAQ</h2>
            <details>
                <summary>Is this real money?</summary>
                <p>No. Pledges are simulated in PokeDollars for demo (nintendo please don't sue me)</p>
            </details>
            <details>
                <summary>Can I edit my fundraiser?</summary>
                <p>You can edit your fundraiser's title, description, image, and items. The goal can't go below
                    what is already pledged.
                </p>
            </details>
            <details>
                <summary>Do I need an account to pledge?</summary>
                <p>Yes - this keeps the platform safe and accountable. It also allows you to track your pledges.</p>
            </details>
        </section>
    </div>
  );
};

export default AboutPage;