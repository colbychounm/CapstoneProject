import { useRef } from 'react';

import './Modal.css';
import './CheckoutPage.css';

function SaveChangesModal({ setShowSaveChangesModal, setSaveAllChanges }) {
    const exitPageWhenCancelRef = useRef();
    const exitPageWhenSaveRef = useRef();

    //Cancel all changes when exit checkout page
    const handleCancelChanges = () => {
        setShowSaveChangesModal(false)
        exitPageWhenCancelRef.current.setAttribute("href", '/customer')
    }

    //Save all changes when exit checkout page
    const handleSaveChanges = () => {
        setShowSaveChangesModal(false)
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

export default SaveChangesModal;