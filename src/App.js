import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

import './App.css';
import MainPage from './pages/main/MainPage';
import OwnerPage from './pages/owner/OwnerPage';
import BrowsePage from './pages/browse/BrowsePage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProductDetail from './pages/browse/ProductDetail';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import Modal from './common/Modal';

export const CustomerId = React.createContext('');

function App() {
  const [customerId, setCustomerId] = useState('');
  return (
    <CustomerId.Provider value={[customerId, setCustomerId]}>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<MainPage />} />
          <Route path='owner' element={<OwnerPage />} />
          <Route path='customer' element={<BrowsePage />} >
            <Route path='product-detail' element={<ProductDetail />} />
          </Route>
          <Route path='checkout'
            element={<CheckoutPage />}
          />
          <Route path='checkout-success' element={<CheckoutSuccess />} />
        </Routes>
      </BrowserRouter>
    </CustomerId.Provider>
  );
}

export default App;
