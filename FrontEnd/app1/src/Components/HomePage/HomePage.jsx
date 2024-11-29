import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import homepageBackground from "../../assets/homepageBackground.webp";
import "./HomePage.css";

const HomePage = () => {
  // Refs for animation targets
  const backgroundRef = useRef(null);
  const overlayRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    // GSAP Timeline for animations
    const timeline = gsap.timeline();

    // Animate the background image
    timeline.fromTo(
      backgroundRef.current,
      { scale: 1.2, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2, ease: "power2.out" }
    );

    // Animate the content overlay container
    timeline.fromTo(
      overlayRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" },
      "-=1.5"
    );

    // Staggered animation for heading and paragraph
    timeline.fromTo(
      [headingRef.current, paragraphRef.current],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power1.out" },
      "-=1"
    );
  }, []);

  return (
    <>
      <div className="home-container">
        <img
          className="homepageBackground"
          src={homepageBackground}
          alt="Background"
          draggable="false"
          ref={backgroundRef}
        />
        <div className="content-overlay" ref={overlayRef}>
          <h1 ref={headingRef}>Welcome to Athlete Tracker</h1>
          <p ref={paragraphRef}>
            Track your performance, monitor your health, and achieve your goals.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
