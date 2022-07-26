import './Footer.css';

function Footer() {
    return (
        <div className="footer">
            <div className="footer-left">
                <h5 className="footer-title">ABOUT US</h5>
                <p className="footer-text">We craft affordable, high-quality menswear for your everyday and once-in-a-lifetime moments.</p>
                <div className="footer-icon">
                    <button>
                        <i className="fab fa-facebook-f"></i>
                    </button>
                    <button>
                        <i className="fab fa-twitter"></i>
                    </button>
                    <button>
                        <i className="fab fa-instagram"></i>
                    </button>
                </div>
            </div>
            <div className="footer-center">
                <h5 className="footer-title">SERVICES</h5>
                <ul className="footer-list">
                    <li><a className="footer-text" href="/">Contact Us</a></li>
                    <li><a className="footer-text" href="/">Unhemmed</a></li>
                    <li><a className="footer-text" href="/">Returns and Exchanges</a></li>
                    <li><a className="footer-text" href="/">Terms and Conditions</a></li>
                    <li><a className="footer-text" href="/">Privacy</a></li>
                    <li><a className="footer-text" href="/">Help</a></li>
                </ul>
            </div>
            <div className="footer-right">
                <h5 className="footer-title">NEWSLETTER</h5>
                <p className="footer-text">Subscribe to receive updates, access to exclusive deals, and more.</p>
                <input className="footer-input" placeholder="Enter your email address" />
                <button className="footer-button">SUBSCRIBE</button>
            </div>
        </div>
    )
}

export default Footer;