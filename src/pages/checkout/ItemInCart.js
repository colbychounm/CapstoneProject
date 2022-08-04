import { useLazyQuery, useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

import { GET_CART_ITEMS } from '../../data/queries/get-cart';
import { GET_PRODUCT } from '../../data/queries/get-product';
import { MUTATION_PRODUCT } from '../../data/mutations/update-product';
import { MUTATION_CUSTOMER } from '../../data/mutations/update-customer';
import { EMPTY_CART } from '../../data/mutations/empty-cart';
import CartTotalPrice from './CartTotalPrice';
import { CustomerId } from '../../App.js';

function ItemInCart({
    isLocationUpdate,
    setIsLocationUpdate,
    setIsCheckoutSuccess,
    isCheckoutSuccess,
    setShowRemoveItemModal,
    showRemoveItemModal,
    isItemRemoved,
    setIsItemRemoved,
    setIsCartAvailable,
    saveAllChanges }) {

    let cartItem = {}
    let cart = []

    const [customerId, setCustomerId] = useContext(CustomerId)
    console.log("context", customerId)

    const [queryCart] = useLazyQuery(GET_CART_ITEMS);
    const [queryProductInCart] = useLazyQuery(GET_PRODUCT);
    const [updateProductStock] = useMutation(MUTATION_PRODUCT);
    const [emptyCart] = useMutation(EMPTY_CART)
    const [updateAllChanges] = useMutation(MUTATION_CUSTOMER);

    const [itemsInCart, setItemsInCart] = useState([]);
    const [detailProducts, setDetailProducts] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [stock, setStock] = useState([]);
    const [productsPrice, setProductsPrice] = useState([]);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [checkedState, setCheckedState] = useState([]);

    // Query item in customer's cart and detail of product 
    const queryCustomerCart = () => {
        const promiseQueryCart = new Promise((resolve) => {
            queryCart(
                { variables: { customerCustomerId2: "Chau" } }
            ).then(res => {
                const resObj = {};
                const data = res.data.customer.items;

                let cartItem = {};
                const cart = [];

                const getCart = new Promise((resolve) => {
                    data.forEach((item) => {
                        cartItem = { ...item }
                        cart.push(cartItem)
                    })
                    resolve(cart)
                })
                getCart.then(res => {
                    res.forEach((item) => {
                        if (!resObj[item.productId]) {
                            resObj[item.productId] = []
                        }
                        resObj[item.productId].push(item)
                    })
                }).then(() => {
                    const itemsArray = Object.values(resObj);

                    const result = itemsArray.map((item) => {
                        const res = item.reduce((prev, curr) => {
                            return {
                                ...curr,
                                quantity: curr.quantity + prev.quantity
                            }
                        }, { quantity: 0 })
                        return res
                    })
                    setItemsInCart(result)
                    resolve(result)
                })
            })
        })

        promiseQueryCart.then(async (res) => {
            //Query detail product in cart
            //and get stock of products
            //and get price of products
            const newProducts = [];
            const itemsStock = [];
            const productsPrice = [];
            for (const item of res) {
                const { data } = await queryProductInCart({ variables: { productId: item.productId } })
                newProducts.push(data.product)
                itemsStock.push(data.product.stock)
                productsPrice.push(data.product.price)
            }
            setDetailProducts(newProducts)
            setStock(itemsStock)
            setProductsPrice(productsPrice)

            //Get quantity of items
            const itemsQuantity = []
            res.forEach((item) => {
                itemsQuantity.push(item.quantity)
            })
            setQuantity(itemsQuantity)
        })
    }

    //Create array of cartItem object that have detail product
    if (itemsInCart) {
        itemsInCart.forEach((item, index) => {
            cartItem = { ...item, product: detailProducts[index] };
            cart.push(cartItem);
        })
    }

    //Decrease quantity of item
    const handleDecrease = (index) => {
        const newQuantityArray = [...quantity]
        newQuantityArray[index]--
        setQuantity(newQuantityArray)
        if (newQuantityArray[index] <= 0) {
            newQuantityArray[index] = 0;
            setQuantity(newQuantityArray)
            setShowRemoveItemModal(true)
        }
    }

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

    //Query customer cart
    useEffect(() => {
        queryCustomerCart()
    }, [])

    //Checkout and edit product's stock
    useEffect(() => {
        if (isCheckoutSuccess) {
            if (itemsInCart) {
                const itemsCheckout = [];
                const itemsRemainInCart = [];
                const itemsCheckoutStock = [];
                const itemsCheckoutQuantity = [];
                const itemsRemainQuantity = [];

                const handleUpdateStock = new Promise((resolve) => {
                    checkedState.forEach((value, index) => {
                        if (value === false) {
                            itemsRemainInCart.push(itemsInCart[index]);
                            itemsRemainQuantity.push(quantity[index])
                        } else {
                            itemsCheckout.push(itemsInCart[index]);
                            itemsCheckoutStock.push(stock[index]);
                            itemsCheckoutQuantity.push(quantity[index]);
                        }
                    })
                    resolve([itemsRemainInCart, itemsRemainQuantity, itemsCheckout, itemsCheckoutStock, itemsCheckoutQuantity])
                })
                handleUpdateStock.then(res => {
                    const itemsRemainInCart = res[0];
                    const itemsRemainQuantity = res[1];
                    const itemsCheckout = res[2];
                    const itemsCheckoutStock = res[3];
                    const itemsCheckoutQuantity = res[4];

                    itemsCheckout.forEach(async (item, index) => {
                        await updateProductStock({
                            variables: {
                                updateProductProduct2: {
                                    id: `${item.productId}`,
                                    stock: itemsCheckoutStock[index] - itemsCheckoutQuantity[index]
                                }
                            }
                        })
                    })
                    return [itemsRemainInCart, itemsRemainQuantity]
                }).then((res) => {
                    console.log(res[0])
                    console.log(res[1])
                    const cartAfterSave = [];
                    res[0].forEach((item, index) => {
                        const itemInCartAfterSave = {
                            productId: `${item.productId}`,
                            color: `${item.color}`,
                            size: `${item.size}`,
                            quantity: res[1][index]
                        }
                        cartAfterSave.push(itemInCartAfterSave)
                    })
                    updateAllChanges({
                        variables: {
                            customer: {
                                customerId: "Chau",
                                items: cartAfterSave
                            },
                        }
                    })
                })

            }

            // emptyCart({
            //     variables: { emptyCartCustomerId2: "Chau" }
            // })
        }
        setIsCheckoutSuccess(false)
    }, [isCheckoutSuccess])

    //When customer try to exit checkout page, update all changes to customer's cart
    useEffect(() => {
        if (saveAllChanges) {
            const cartAfterSave = [];
            cart.forEach((item, index) => {
                const itemInCartAfterSave = {
                    productId: `${item.productId}`,
                    color: `${item.color}`,
                    size: `${item.size}`,
                    quantity: quantity[index]
                }
                cartAfterSave.push(itemInCartAfterSave)
            })
            updateAllChanges({
                variables: {
                    customer: {
                        customerId: "Chau",
                        items: cartAfterSave
                    },
                }
            })
        }
    }, [saveAllChanges])

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
                            <div key={index} className="cart-item">
                                <input name={index} onChange={() => toggleCheck(index)} checked={checkedState[index]} className='item-checkbox' type="checkbox" />
                                <div className="item-img">
                                    <img alt="Product" src={item.product.pictures[0]} />
                                </div>
                                <div className="item-detail">
                                    <h5>{item.product.name}</h5>
                                    <div className="item-variation">
                                        <p>{item.size}</p>
                                        <p>{item.color}</p>
                                    </div>
                                </div>
                                <div className="item-quantity-price">
                                    <div className="quantity-buttons">
                                        <button onClick={() => handleDecrease(index)}>-</button>
                                        <p className="item-quantity">{quantity[index]}</p>
                                        <button onClick={() => handleIncrease(index)}>+</button>
                                    </div>
                                    <h5 className="item-price">${productsPrice[index] * quantity[index]}</h5>
                                </div>
                            </div>
                        )
                    }
                })
            }
            <CartTotalPrice
                productsPrice={productsPrice}
                quantity={quantity}
                isLocationUpdate={isLocationUpdate}
                setIsLocationUpdate={setIsLocationUpdate}
                setIsCartAvailable={setIsCartAvailable}
                checkedState={checkedState}
            />
        </>
    )
}

export default ItemInCart;