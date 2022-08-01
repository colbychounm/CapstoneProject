import { useRef } from 'react';
import './CheckoutPage.css';

function CheckoutNav({ setIsCheckoutSuccess, isCartAvailable, setShowModal }) {

    const checkoutRef = useRef();
    const checkoutButtonRef = useRef();

    const handleCheckout = () => {
        if (isCartAvailable) {
            checkoutRef.current.setAttribute("href", "/checkout-success");
            setIsCheckoutSuccess(true)
        }
    }

    const handleExitPage = () => {
        setShowModal(true)
    }

    return (
        <div className="checkout-nav">
            <a role='link'>
                <button
                    onClick={handleExitPage}
                    className="checkout__nav-button left">
                    <i className="fas fa-angle-left"></i>
                    Return to Browse
                </button>
            </a>
            <a ref={checkoutRef} role="link" aria-disabled={true}>
                <button ref={checkoutButtonRef} onClick={handleCheckout} className={isCartAvailable ? "checkout__nav-button" : "checkout__nav-button disabled"}>
                    Continue to Checkout
                </button>
            </a>
        </div>
    )
}

export default CheckoutNav;