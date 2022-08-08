import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import './CheckoutPage.css';
import { GET_FEE } from '../../data/queries/get-fee';
import { GET_CUSTOMER } from '../../data/queries/get-customer';
import { customerId } from '../main/MainPage';

function CartTotalPrice({
    productsPrice,
    quantity,
    isLocationUpdate,
    setIsLocationUpdate,
    setIsCartAvailable,
    checkedState
}) {
    const [shipping, setShipping] = useState(0);
    const [tax, setTax] = useState(0);

    const [queryFee] = useLazyQuery(GET_FEE)
    const [queryCustomer] = useLazyQuery(GET_CUSTOMER)

    const productsPriceSelected = [...productsPrice];

    //Set product price (only selected item will be counted in subtotal)
    if (checkedState.length === 0) {
        productsPriceSelected.fill(0)
    } else {
        checkedState.forEach((value, index) => {
            if (value === false) {
                productsPriceSelected[index] = 0;
            }
        })
    }

    //Calculate subtotal price of items in cart
    const subtotalPrice = useMemo(() => {
        const sumPrice = productsPriceSelected.reduce(
            (previousValue, currentValue, currentIndex) => {
                return previousValue + currentValue * quantity[currentIndex]
            }, 0);
        return sumPrice
    }, [productsPriceSelected, quantity])

    const totalTax = useMemo(() => {
        return tax * subtotalPrice
    }, [tax, subtotalPrice])

    //Calculate total price of cart including tax and shipping fee
    const total = (subtotalPrice + shipping + totalTax)

    //Query shipping fee and tax
    useEffect(() => {
        queryCustomer({
            variables: { customerCustomerId2: `${customerId}` },
            fetchPolicy: 'cache-and-network'
        }).then(res => {
            queryFee({
                variables: { location: `${res.data.customer.location}` }
            }).then(res => {
                if (res.data) {
                    setShipping(res.data.fee.shipping)
                    setTax(res.data.fee.tax)
                }
            })
        })
        setIsLocationUpdate(false)
    }, [isLocationUpdate])

    //Check if cart is empty or shipping or tax is not available so user can't click checkout button
    useEffect(() => {
        if (subtotalPrice === 0 || (tax === 0)) {
            setIsCartAvailable(false)
        } else {
            setIsCartAvailable(true)
        }
    }, [subtotalPrice, tax, shipping])

    return (
        <div className="checkout__cart-price">
            <div className="checkout__cart-subtotal">
                <div className="checkout__price-detail">
                    <p className="checkout__price-title">Subtotal</p>
                    <h5 className="price">${parseFloat(parseFloat(subtotalPrice).toFixed(2))}</h5>
                </div>
                <div className="checkout__price-detail">
                    <p className="checkout__price-title">Shipping</p>
                    <h5 className="price">${parseFloat(parseFloat(shipping).toFixed(2))}</h5>
                </div>
                <div className="checkout__price-detail">
                    <p className="checkout__price-title">Tax</p>
                    <h5 className="price">${parseFloat(parseFloat(totalTax).toFixed(2))}</h5>
                </div>
            </div>
            <div className="checkout__cart-total">
                <div className="checkout__price-detail">
                    <h3>Total</h3>
                    <h2>${parseFloat(total).toFixed(2)}</h2>
                </div>
            </div>
        </div>
    )
}

export default CartTotalPrice;