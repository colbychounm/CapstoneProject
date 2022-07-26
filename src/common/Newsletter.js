import './Newsletter.css';

function Newsletter() {
    return (
        <div className="newsletter">
            <span className="newsletter-text">BE FIRST</span>
            <input className="newsletter-input" placeholder="Enter your email" />
            <button className="newsletter-button">SUBSCRIBE</button>
        </div>
    )
}

export default Newsletter;