import './Header.css';

function Header() {
    return (
        <header className="mainpage-header">
            <span className="header-left">
                <span className="header-brandname">
                    <img alt="Brand Name" src="//cdn.shopify.com/s/files/1/0098/0202/2971/files/brand-nav-cg-logo-stack_large_5f5bf82f-27b9-48ea-abd3-3e3b57c4cb2a_large.png?v=1553806153" />
                </span>
                <span className="header-brandlogo">
                    <img alt="Teacap" src="//cdn.shopify.com/s/files/1/0098/0202/2971/files/toecap-logo-white_356c8bec-f9a2-4cf9-9385-5e60c9db9d72_large.png?v=1553806137" />
                </span>
            </span>
            <p className="header-center">HAPPY BLACK FRIDAY</p>
        </header>
    )
}

export default Header;