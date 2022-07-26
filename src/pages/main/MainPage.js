import './MainPage.css';
import Header from '../../common/Header';
import NavBar from '../../common/NavBar';
import Newsletter from '../../common/Newsletter';
import Footer from '../../common/Footer';

function MainPage() {
    return (
        <div className="mainpage">
            <Header />
            <NavBar />
            <div className="mainpage-banner">
                <img alt="background" src="https://cdn.shopify.com/s/files/1/0098/0202/2971/files/00A9408_1800x.jpg?v=1606358218" />
                <div className="mainpage-login">
                    <input className="mainpage-input" placeholder="Enter your customer ID" />
                    <button className="mainpage-button">LOG IN</button>
                </div>
            </div>
            <Newsletter />
            <Footer />
        </div>
    )
}

export default MainPage;
