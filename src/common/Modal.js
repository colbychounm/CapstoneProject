import { useRef } from 'react';

import './Modal.css';
import '../pages/checkout/CheckoutPage.css';

function Modal({ setShowModal, setSaveAllChanges }) {
    const exitPageWhenCancelRef = useRef();
    const exitPageWhenSaveRef = useRef();

    //Cancel all changes when exit checkout page
    const handleCancelChanges = () => {
        setShowModal(false)
        exitPageWhenCancelRef.current.setAttribute("href", '/customer')
    }

    //Save all changes when exit checkout page
    const handleSaveChanges = () => {
        setShowModal(false)
        setSaveAllChanges(true)
        exitPageWhenSaveRef.current.setAttribute("href", '/customer')
    }

    return (
        <div className="modal-wrapper">
            <div className="modal-body">
                <h4>Do you want to Save Cart Changes or Cancel All Changes?</h4>
                <div className="modal-buttons">
                    <a ref={exitPageWhenCancelRef} role="link">
                        <button
                            onClick={handleCancelChanges}
                            className='button-cancel'>
                            Cancel All The Changes
                        </button>
                    </a>
                    <a ref={exitPageWhenSaveRef} role="link">
                        <button
                            onClick={handleSaveChanges}
                            className='button-save'>
                            Save Cart Changes
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export function RemoveItemModal({ setShowRemoveItemModal, setIsItemRemoved }) {
    //Handle remove item when quantity is set to 0
    const handleRemoveItem = () => {
        setIsItemRemoved(true)
        setShowRemoveItemModal(false)
    }

    //Handle keep item when quantity is set to 0
    const handleKeepItem = () => {
        setIsItemRemoved(false)
        setShowRemoveItemModal(false)
    }

    return (
        <div className="modal-wrapper">
            <div className="modal-body">
                <h4>Do you want to remove this item out of your cart?</h4>
                <div className="modal-buttons">
                    <button onClick={handleRemoveItem} className='button-cancel'>
                        Yes! Remove item
                    </button>
                    <button onClick={handleKeepItem} className='button-save'>
                        Keep item
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal;