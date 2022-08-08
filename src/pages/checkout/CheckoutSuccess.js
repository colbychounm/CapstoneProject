import './CheckoutPage.css';

function CheckoutSuccess() {
    return <div className='checkout-success'>
        <h1>Congratulation!</h1>
        <a className="checkout-success__link" href='/customer'>Return to browse page</a>
    </div>
}

export default CheckoutSuccess;