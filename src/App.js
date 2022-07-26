import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainPage from './pages/main/MainPage';
import OwnerPage from './pages/owner/OwnerPage';
import BrowsePage from './pages/browse/BrowsePage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProductDetail from './pages/browse/ProductDetail';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<MainPage />} />
        <Route path='owner' element={<OwnerPage />} />
        <Route path='customer' element={<BrowsePage />} >
          <Route path='product-detail' element={<ProductDetail />} />
        </Route>
        <Route path='checkout' element={<CheckoutPage />} />
        <Route path='checkout-success' element={<CheckoutSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
