import CartTotalPrice from './CartTotalPrice';

import { useEffect, useState } from 'react';

function ItemInCart({
    cart,
    itemsInCart,
    quantity,
    productsPrice,
    checkedState,
    setCheckedState,
    isLocationUpdate,
    setIsLocationUpdate,
    setIsCartAvailable,
    stock,
    setQuantity,
    setShowRemoveItemModal,
    setSelectIndex }) {
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

    //Set checked state after query items in cart
    useEffect(() => {
        setCheckedState(new Array(itemsInCart.length).fill(true))
    }, [itemsInCart])

    //Select item in cart
    const toggleCheck = (position) => {
        setCheckedState((prevState) => {
            const newState = [...prevState];
            newState[position] = !prevState[position];
            return newState;
        });
    }

    //Select all items in cart
    const handleSelectAll = (value) => {
        setIsSelectAllChecked(value)
        setCheckedState((prevState) => {
            const newState = [...prevState];
            for (const index in newState) {
                newState[index] = value;
            }
            return newState;
        });
    }

    //Handle select all state when deselect an item
    useEffect(() => {
        let allChecked = true;
        for (const index in checkedState) {
            if (checkedState[index] === false) {
                allChecked = false;
            }
        }
        if (allChecked) {
            setIsSelectAllChecked(true);
        } else {
            setIsSelectAllChecked(false);
        }
    }, [checkedState]);

    //Increase quantity of item
    const handleIncrease = (index) => {
        const newQuantityArray = [...quantity]
        newQuantityArray[index]++
        if (newQuantityArray[index] > stock[index]) {
            newQuantityArray[index] = stock[index]
            setQuantity(newQuantityArray)
        }
        setQuantity(newQuantityArray)
    }

    //Decrease quantity of item
    const handleDecrease = (index) => {
        setSelectIndex(index)
        const newQuantityArray = [...quantity]

        newQuantityArray[index]--
        setQuantity(newQuantityArray)
        if (newQuantityArray[index] <= 0) {
            newQuantityArray[index] = 0;
            setQuantity(newQuantityArray)
            setShowRemoveItemModal(true)
        }
    }

    return (
        <>
            <h4 className='checkout-form__title'>
                <input checked={isSelectAllChecked} onChange={e => handleSelectAll(e.target.checked)} className='item-checkbox' type="checkbox" />
                Select All
            </h4>
            {
                cart.map((item, index) => {
                    if (item.product) {
                        return (
                            <div key={index} className="checkout__cart-item">
                                <input name={index} onChange={() => toggleCheck(index)} checked={checkedState[index]} className='item-checkbox' type="checkbox" />
                                <div className="checkout__item-img">
                                    <img alt="Product" src={item.product.pictures[0]} />
                                </div>
                                <div className="checkout__item-detail">
                                    <h5>{item.product.name}</h5>
                                    <div className="checkout__item-variation">
                                        <p>{item.size}</p>
                                        <p>{item.color}</p>
                                    </div>
                                </div>
                                <div className="checkout__item-quantity-price">
                                    <div className="checkout__quantity-buttons">
                                        <button onClick={() => handleDecrease(index)}>-</button>
                                        <p className="checkout__item-quantity">{quantity[index]}</p>
                                        <button onClick={() => handleIncrease(index)}>+</button>
                                    </div>
                                    <h5 className="checkout__item-price">${productsPrice[index] * quantity[index]}</h5>
                                </div>
                            </div>
                        )
                    }
                })
            }
            <CartTotalPrice
                quantity={quantity}
                productsPrice={productsPrice}
                checkedState={checkedState}
                isLocationUpdate={isLocationUpdate}
                setIsLocationUpdate={setIsLocationUpdate}
                setIsCartAvailable={setIsCartAvailable}
            />
        </>
    )
}

export default ItemInCart;