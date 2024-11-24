import React from 'react'
import homepageBackground from '../../assets/homepageBackground.webp'
import'./HomePage.css'
const HomePage = () => {
    return (
    <>
    <div className="home-container">
        <img
            className="homepageBackground"
            src={homepageBackground}
            draggable="false"
            />
        </div>
        <div className="content-overlay">
            <h1>Welcome to Athlete Tracker</h1>
            <p>
                Track your performance, monitor your health, and achieve your goals.
            </p>
        </div>
    </>
    );
}

export default HomePage
