import './CheckoutPage.css';
import ItemInCart from './ItemInCart';

function CheckoutPage() {
    return (
        <div className="checkoutpage">
            <div className="checkout-body">
                <div className="checkout-cart">
                    <div className="cart-items">
                        <ItemInCart />
                    </div>
                    <div className="cart-price">
                        <div className="cart-subtotal">
                            <div className="price-detail">
                                <p className="price-title">Subtotal</p>
                                <h5 className="price">$30.00</h5>
                            </div>
                            <div className="price-detail">
                                <p className="price-title">Shipping</p>
                                <h5 className="price">$5.00</h5>
                            </div>
                        </div>
                        <div className="cart-total">
                            <div className="price-detail">
                                <h3>Total</h3>
                                <h2>$35.00</h2>
                            </div>
                        </div>
                    </div>
                    <div className="checkout-nav">
                        <a href='/customer'>
                            <button className="checkout__nav-button left">
                                <i className="fas fa-angle-left"></i>
                                Return to Browse Page
                            </button>
                        </a>
                        <a href='/checkout-success'>
                            <button className="checkout__nav-button">Continue to checkout</button>
                        </a>
                    </div>
                </div>
                <div className="checkout-form">
                    <form>
                        <label>ABC</label>
                        <input placeholder="Your name" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage;