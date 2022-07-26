import Header from '../../common/Header';
import NavBar from '../../common/NavBar';
import Footer from '../../common/Footer';
import { Outlet } from 'react-router-dom'

function BrowsePage() {
    return (
        <>
            <div className="browsepage">
                <Header />
                <NavBar />
                <div>BrowsePage</div>
                <Footer />
            </div>
            {/* <Outlet /> */}
        </>

    )
}

export default BrowsePage;