import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import './App.css';
import MainPage from './pages/main/MainPage';
import OwnerPage from './pages/owner/OwnerPage';
import BrowsePage from './pages/browse/BrowsePage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProductDetail from './pages/browse/ProductDetail';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<MainPage />} />
        <Route path='owner' element={<OwnerPage />} />
        <Route path='customer' element={<BrowsePage />} >
        </Route>
        <Route path='product-detail/:id' element={<ProductDetail />} />
        <Route path='checkout'
          element={<CheckoutPage />}
        />
        <Route path='checkout-success' element={<CheckoutSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
