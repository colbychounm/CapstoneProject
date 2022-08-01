import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { GET_CART_ITEMS } from '../../data/queries/get-cart';
import { GET_PRODUCT } from '../../data/queries/get-product';
import { MUTATION_PRODUCT } from '../../data/mutations/update-product';
import { MUTATION_CUSTOMER } from '../../data/mutations/update-customer';
import { EMPTY_CART } from '../../data/mutations/empty-cart';
import CartTotalPrice from './CartTotalPrice';

function ItemInCart({
    isLocationUpdate,
    setIsLocationUpdate,
    setIsCheckoutSuccess,
    isCheckoutSuccess,
    setShowRemoveItemModal,
    isItemRemoved,
    setIsItemRemoved,
    setIsCartAvailable,
    saveAllChanges }) {

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
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)
    const [isChecked, setIsChecked] = useState(false);

    let cartItem = {}
    let cart = []

    // Query item in customer's cart and detail of product 
    const queryCustomerCart = () => {
        const promiseQueryCart = new Promise((resolve) => {
            queryCart(
                { variables: { customerCustomerId2: "Chau" } }
            ).then(res => {
                setItemsInCart(res.data.customer.items)
                resolve(res.data.customer.items)

                // const data = res.data.customer.items
                // let cartItem = {};
                // let cart = []
                // data.forEach((item) => {
                //     cartItem = { ...item }
                //     cart.push(cartItem)
                // })
                // const mergeDuplicateItems = new Promise((resolve) => {
                //     for (let i = 0; i < cart.length; i++) {
                //         for (let j = 1; j < cart.length; j++) {
                //             if (cart[i].productId === cart[j].productId
                //                 && cart[i].color === cart[j].color
                //                 && cart[i].size === cart[j].size
                //             ) {
                //                 cart[j].quantity = cart[i].quantity + cart[j].quantity;
                //                 cart.splice(i, 1)
                //             }
                //         }
                //     }
                //     resolve(cart)
                // });
                // mergeDuplicateItems
                //     .then(res => {
                //         console.log(res)
                //         setItemsInCart(res)
                //         resolve(res)
                //     })
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
            cartItem = { ...item, product: detailProducts[index] }
            cart.push(cartItem)
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
        // const decreaseQuantity = new Promise((resolve) => {
        //     newQuantityArray[index]--
        //     setQuantity(newQuantityArray)
        //     if (newQuantityArray[index] <= 0) {
        //         newQuantityArray[index] = 0;
        //         setQuantity(newQuantityArray)
        //         setShowRemoveItemModal(true)
        //     }
        //     resolve(isItemRemoved)
        // })
        // //Remove item out of cart if quantity is set to 0 and customer click remove button
        // decreaseQuantity
        //     .then(res => {
        //         console.log("Res", res)
        //         if (res === true) {
        //             console.log("here")
        //             const cartAfterRemove = [];
        //             cart.forEach((item, itemIndex) => {
        //                 if (index !== itemIndex) {
        //                     const itemInCartAfterRemove = {
        //                         productId: `${item.productId}`,
        //                         color: `${item.color}`,
        //                         quantity: quantity[itemIndex]
        //                     }
        //                     cartAfterRemove.push(itemInCartAfterRemove)
        //                 }

        //             })
        //             updateAllChanges({
        //                 variables: {
        //                     customer: {
        //                         customerId: "Chau",
        //                         items: cartAfterRemove
        //                     }
        //                 }
        //             })
        //         } else {
        //             newQuantityArray[index] = 1;
        //             setQuantity(newQuantityArray)
        //         }
        //     })
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

    const handleSelectAll = () => {
        setIsSelectAllChecked(!isSelectAllChecked)
        handleSelect();
    }

    const handleSelect = () => {
        setIsChecked(!isChecked)
        if (isSelectAllChecked) {
            setIsChecked(!isChecked)
            // setIsSelectAllChecked(!isSelectAllChecked)
        }
    }

    //Query customer cart
    useEffect(() => {
        queryCustomerCart()
    }, [])

    //Checkout and edit product's stock
    useEffect(() => {
        if (itemsInCart) {
            itemsInCart.forEach(async (item, index) => {
                await updateProductStock({
                    variables: {
                        updateProductProduct2: {
                            id: `${item.productId}`,
                            stock: stock[index] - quantity[index]
                        }
                    }
                })
            })
        }
        if (isCheckoutSuccess) {
            emptyCart({
                variables: { emptyCartCustomerId2: "Chau" }
            })
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
                <input onChange={handleSelectAll} checked={isSelectAllChecked} className='item-checkbox' type="checkbox" />
                Select All
            </h4>
            {
                cart.map((item, index) => {
                    if (item.product) {
                        return (
                            <div key={index} className="cart-item">
                                <input onChange={handleSelect} checked={isChecked} className='item-checkbox' type="checkbox" />
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
            />
        </>
    )
}

export default ItemInCart;