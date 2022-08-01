import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import './CheckoutPage.css';
import { GET_FEE } from '../../data/queries/get-fee';
import { GET_CUSTOMER } from '../../data/queries/get-customer';

function CartTotalPrice({
    productsPrice,
    quantity,
    isLocationUpdate,
    setIsLocationUpdate,
    setIsCartAvailable
}) {
    const [shipping, setShipping] = useState(0);
    const [tax, setTax] = useState(0);

    const [queryFee] = useLazyQuery(GET_FEE)
    const [queryCustomer] = useLazyQuery(GET_CUSTOMER)

    //Calculate subtotal price of items in cart
    const subtotalPrice = useMemo(() => {
        const sumPrice = productsPrice.reduce(
            (previousValue, currentValue, currentIndex) => {
                return previousValue + currentValue * quantity[currentIndex]
            }, 0);
        return sumPrice
    }, [productsPrice, quantity])

    const totalTax = useMemo(() => {
        return tax * subtotalPrice
    }, [tax, subtotalPrice])

    //Calculate total price of cart including tax and shipping fee
    const total = (subtotalPrice + shipping + totalTax)

    //Query shipping fee and tax
    useEffect(() => {
        queryCustomer({
            variables: { customerCustomerId2: "Chau" },
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
        <div className="cart-price">
            <div className="cart-subtotal">
                <div className="price-detail">
                    <p className="price-title">Subtotal</p>
                    <h5 className="price">${parseFloat(parseFloat(subtotalPrice).toFixed(2))}</h5>
                </div>
                <div className="price-detail">
                    <p className="price-title">Shipping</p>
                    <h5 className="price">${parseFloat(parseFloat(shipping).toFixed(2))}</h5>
                </div>
                <div className="price-detail">
                    <p className="price-title">Tax</p>
                    <h5 className="price">${parseFloat(parseFloat(totalTax).toFixed(2))}</h5>
                </div>
            </div>
            <div className="cart-total">
                <div className="price-detail">
                    <h3>Total</h3>
                    <h2>${parseFloat(total).toFixed(2)}</h2>
                </div>
            </div>
        </div>
    )
}

export default CartTotalPrice;