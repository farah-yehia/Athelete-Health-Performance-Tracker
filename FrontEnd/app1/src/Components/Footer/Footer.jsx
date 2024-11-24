import React from 'react'
import './Footer.css'
const Footer = () => {
    return (
    <div>
        <footer
        className="footer"
        >
            <p>
                All Rights Reserved &copy; {new Date().getFullYear()}
            </p>
            </footer>
    </div>
    );
}

export default Footer
