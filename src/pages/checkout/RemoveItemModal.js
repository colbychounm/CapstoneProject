import './Modal.css';
import './CheckoutPage.css';

function RemoveItemModal({ setShowRemoveItemModal, setIsItemRemoved }) {

    //Handle remove item when quantity is set to 0
    const handleRemoveItem = () => {
        setShowRemoveItemModal(false)
        setIsItemRemoved(true)
    }

    //Handle keep item when quantity is set to 0
    const handleKeepItem = () => {
        setShowRemoveItemModal(false)
        setIsItemRemoved(false)
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

export default RemoveItemModal;