import './NavBar.css';

function NavBar() {
    return (
        <div className="mainpage-navbar">
            <span className="navbar-left">
                <a href="/customer">SHOP</a>
            </span>
            <span className="navbar-center">
                <img alt="Brand Logo" src="https://cdn.shopify.com/s/files/1/0098/0202/2971/files/cg-symbol_50x@2x.png?v=1538602072" />
            </span>
            <span className="navbar-right">
                <a href="/owner">ACCOUNT</a>
                <a href="/customer">BROWSE</a>
                <a href="/checkout">CHECKOUT</a>
            </span>
        </div>
    )
}

export default NavBar;