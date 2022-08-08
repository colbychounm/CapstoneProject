import './CheckoutPage.css';
import ItemInCart from './ItemInCart';
import CustomerForm from './CustomerForm';
import CheckoutNav from './CheckoutNav';
import SaveChangesModal from './SaveChangesModal';
import RemoveItemModal from './RemoveItemModal';
import { GET_CUSTOMER } from '../../data/queries/get-customer';
import { GET_PRODUCT } from '../../data/queries/get-product';
import { MUTATION_PRODUCT } from '../../data/mutations/update-product';
import { MUTATION_CUSTOMER } from '../../data/mutations/update-customer';
import { customerId } from '../main/MainPage';

import { useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState, useRef } from 'react'

function CheckoutPage() {
    const isFirstRender = useRef(true)

    const [itemsInCart, setItemsInCart] = useState([]);
    const [detailProducts, setDetailProducts] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [stock, setStock] = useState([]);
    const [productsPrice, setProductsPrice] = useState([]);
    const [selectIndex, setSelectIndex] = useState();

    const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);
    const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
    const [saveAllChanges, setSaveAllChanges] = useState(false);
    const [checkedState, setCheckedState] = useState([]);
    const [isLocationUpdate, setIsLocationUpdate] = useState(false);
    const [isCartAvailable, setIsCartAvailable] = useState(true);
    const [isItemRemoved, setIsItemRemoved] = useState(undefined);

    let cartItem = {};
    let cart = [];

    const [queryCart, { data }] = useLazyQuery(GET_CUSTOMER);
    const [queryProductInCart] = useLazyQuery(GET_PRODUCT);
    const [updateProductStock] = useMutation(MUTATION_PRODUCT);
    const [updateAllChanges] = useMutation(MUTATION_CUSTOMER);

    // Query item in customer's cart and detail of product 
    const queryCustomerCart = () => {
        const promiseQueryCart = new Promise((resolve) => {
            queryCart(
                {
                    variables: { customerCustomerId2: customerId },
                    fetchPolicy: 'cache-and-network'
                }
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
                        if (!resObj[`${item.productId}` + `${item.color}` + `${item.size}`]) {
                            resObj[`${item.productId}` + `${item.color}` + `${item.size}`] = []
                        }
                        resObj[`${item.productId}` + `${item.color}` + `${item.size}`].push(item)
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
                                    id: item.productId,
                                    stock: itemsCheckoutStock[index] - itemsCheckoutQuantity[index]
                                }
                            }
                        })
                    })
                    return [itemsRemainInCart, itemsRemainQuantity]
                }).then((res) => {
                    const cartAfterSave = [];
                    res[0].forEach((item, index) => {
                        const itemInCartAfterSave = {
                            productId: item.productId,
                            color: item.color,
                            size: item.size,
                            quantity: res[1][index]
                        }
                        cartAfterSave.push(itemInCartAfterSave)
                    })
                    updateAllChanges({
                        variables: {
                            customer: {
                                customerId: customerId,
                                items: cartAfterSave
                            },
                        }
                    })
                })
            }
        }
        setIsCheckoutSuccess(false)
    }, [isCheckoutSuccess])

    //When customer try to exit checkout page, update all changes to customer's cart
    useEffect(() => {
        if (saveAllChanges) {
            const cartAfterSave = [];
            cart.forEach((item, index) => {
                const itemInCartAfterSave = {
                    productId: item.productId,
                    color: item.color,
                    size: item.size,
                    quantity: quantity[index]
                }
                cartAfterSave.push(itemInCartAfterSave)
            })
            updateAllChanges({
                variables: {
                    customer: {
                        customerId: customerId,
                        items: cartAfterSave
                    },
                }
            })
        }
    }, [saveAllChanges])

    //Remove item out of cart if quantity is set to 0 and customer click remove button
    const handleRemoveOrKeepItem = useCallback((index) => {
        const newQuantityArray = [...quantity]
        console.log("is item removed", isItemRemoved)
        if (isItemRemoved === true) {
            const cartAfterRemove = [];
            cart.forEach((item, itemIndex) => {
                if (index !== itemIndex) {
                    const itemInCartAfterRemove = {
                        productId: item.productId,
                        color: item.color,
                        quantity: quantity[itemIndex],
                        size: item.size
                    }
                    cartAfterRemove.push(itemInCartAfterRemove)
                }

            })
            updateAllChanges({
                variables: {
                    customer: {
                        customerId: customerId,
                        items: cartAfterRemove
                    }
                }
            }).then(() => {
                queryCustomerCart()
            })
        } else {
            newQuantityArray[index] = 1;
            setQuantity(newQuantityArray)
        }
    }, [isItemRemoved])

    //Run handleRemoveOrKeepItem method except the initial rendering
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        handleRemoveOrKeepItem(selectIndex)
        setIsItemRemoved(undefined)
    }, [isItemRemoved])

    return (
        <>
            <div className="checkoutpage-wrapper">
                {showSaveChangesModal
                    ? <SaveChangesModal
                        setShowSaveChangesModal={setShowSaveChangesModal}
                        setSaveAllChanges={setSaveAllChanges}
                    />
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
                            <div className="checkout__cart-items">
                                <ItemInCart
                                    cart={cart}
                                    itemsInCart={itemsInCart}
                                    quantity={quantity}
                                    productsPrice={productsPrice}
                                    checkedState={checkedState}
                                    setCheckedState={setCheckedState}
                                    isLocationUpdate={isLocationUpdate}
                                    setIsLocationUpdate={setIsLocationUpdate}
                                    setIsCartAvailable={setIsCartAvailable}
                                    stock={stock}
                                    setQuantity={setQuantity}
                                    setShowRemoveItemModal={setShowRemoveItemModal}
                                    setSelectIndex={setSelectIndex}
                                />
                            </div>
                            <CheckoutNav
                                setIsCheckoutSuccess={setIsCheckoutSuccess}
                                isCartAvailable={isCartAvailable}
                                setShowSaveChangesModal={setShowSaveChangesModal} />
                        </div>
                        <div className="checkout-form">
                            <CustomerForm
                                setIsLocationUpdate={setIsLocationUpdate}
                                queryCart={queryCart}
                                data={data}
                                updateAllChanges={updateAllChanges} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default CheckoutPage;