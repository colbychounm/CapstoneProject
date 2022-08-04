import './MainPage.css';
import Header from '../../common/Header';
import NavBar from '../../common/NavBar';
import Newsletter from '../../common/Newsletter';
import Footer from '../../common/Footer';
import { CustomerId } from '../../App.js';

import React, { useRef, useState, useContext, useEffect } from 'react';

// export const CustomerId = React.createContext('');

function MainPage() {
    const [customerId, setCustomerId] = useContext(CustomerId)

    useEffect(() => {
        console.log(customerId)
    }, [customerId])

    const [input, setInput] = useState('');
    // const [customerId, setCustomerId] = useState('');
    const inputRef = useRef();

    const handleGetCustomerId = () => {
        setCustomerId(input)
        setTimeout(() => {
            inputRef.current.value = ''
            alert("Welcome!")
        }, 500)
    }
    return (
        // <CustomerId.Provider value={customerId}>
        <div className="mainpage">
            <Header />
            <NavBar />
            <div className="mainpage-banner">
                <img alt="background" src="https://cdn.shopify.com/s/files/1/0098/0202/2971/files/00A9408_1800x.jpg?v=1606358218" />
                <div className="mainpage-login">
                    <input ref={inputRef} onChange={(e) => setInput(e.target.value)} value={input} className="mainpage-input" placeholder="Enter your customer ID" />
                    <button onClick={handleGetCustomerId} className="mainpage-button">LOG IN</button>
                </div>
            </div>
            <Newsletter />
            <Footer />
        </div>
        // </CustomerId.Provider>
    )
}

export default MainPage;
