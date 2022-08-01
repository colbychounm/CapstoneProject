import './CheckoutPage.css';

function CheckoutSuccess() {
    return <div className='checkout-success'>
        <h1>Congratulation!</h1>
        <a className="checkout-success__link" href='/'>Return to main page</a>
    </div>
}

export default CheckoutSuccess;