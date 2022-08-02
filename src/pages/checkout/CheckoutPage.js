import './CheckoutPage.css';
import ItemInCart from './ItemInCart';
import CustomerForm from './CustomerForm';
import CheckoutNav from './CheckoutNav';
import Modal from '../../common/Modal';
import { RemoveItemModal } from '../../common/Modal';

import { useState } from 'react';

function CheckoutPage() {
    const [isLocationUpdate, setIsLocationUpdate] = useState(false);
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
    const [isCartAvailable, setIsCartAvailable] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
    const [isItemRemoved, setIsItemRemoved] = useState(false);
    const [saveAllChanges, setSaveAllChanges] = useState(false);

    return (
        <>
            <div className="checkoutpage-wrapper">
                {showModal
                    ? <Modal
                        setShowModal={setShowModal}
                        setSaveAllChanges={setSaveAllChanges} />
                    : <></>}
                {showRemoveItemModal
                    ? <RemoveItemModal
                        setShowRemoveItemModal={setShowRemoveItemModal}
                        setIsItemRemoved={setIsItemRemoved}
                    />
                    : <></>}

                <div className="checkoutpage">
                    <div className="checkout-body">
                        <div className="checkout-cart">
                            <div className="cart-items">
                                <ItemInCart
                                    isCheckoutSuccess={isCheckoutSuccess}
                                    setIsCheckoutSuccess={setIsCheckoutSuccess}
                                    setIsLocationUpdate={setIsLocationUpdate}
                                    isLocationUpdate={isLocationUpdate}
                                    setShowRemoveItemModal={setShowRemoveItemModal}
                                    showRemoveItemModal={showRemoveItemModal}
                                    isItemRemoved={isItemRemoved}
                                    setIsItemRemoved={setIsItemRemoved}
                                    setIsCartAvailable={setIsCartAvailable}
                                    saveAllChanges={saveAllChanges}
                                />
                            </div>
                            <CheckoutNav
                                setIsCheckoutSuccess={setIsCheckoutSuccess}
                                setShowModal={setShowModal}
                                isCartAvailable={isCartAvailable} />
                        </div>
                        <div className="checkout-form">
                            <CustomerForm setIsLocationUpdate={setIsLocationUpdate} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CheckoutPage;