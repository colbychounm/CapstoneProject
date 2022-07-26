import { useQuery } from '@apollo/client';
import { useState } from 'react';
// import { useEffect } from 'react';

import { GET_CART_ITEMS } from '../../data/queries/get-cart';

function ItemInCart() {
    // const [priceItem, setPriceItem] = useState(30);
    const [quantity, setQuantity] = useState(0);
    const { loading, error, data } = useQuery(GET_CART_ITEMS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // data?.customer?.items.map((item) => {
    //     const { loading, error, data } = useQuery(GET_ITEM);
    //     console.log(data)
    // })

    const handleDecreaseQuantity = (quantity) => {
        if (quantity <= 0) {
            quantity = 0
        } else {
            quantity -= quantity
            setQuantity(quantity)
        }
    }

    const handleIncreaseQuantity = (quantity) => {
        if (quantity <= 0) {
            quantity = 0
        } else {
            quantity += quantity
            setQuantity(quantity)
        }
    }

    console.log(data.customer.items)
    return data?.customer?.items ? (
        data.customer.items.map((item, index) => {
            // setQuantity(item.quantity)
            return (
                <div key={index} className="cart-item">
                    <div className="item-img">
                        <img alt="Product" src="https://cdn.shopify.com/s/files/1/0098/0202/2971/products/00A7914_small.jpg?v=1576726183" />
                    </div>
                    <div className="item-detail">
                        <h5>Grey Knit Nylon Jacket</h5>
                        <div className="item-variation">
                            <p>{item.size}</p>
                            <p>{item.color}</p>
                        </div>
                    </div>
                    <div className="item-quantity-price">
                        <div className="quantity-buttons">
                            <button onClick={() => handleDecreaseQuantity(quantity)}>-</button>
                            <p className="item-quantity">{item.quantity}</p>
                            <button onClick={() => handleIncreaseQuantity(quantity)}>+</button>
                        </div>
                        <h5>$30</h5>
                    </div>
                </div>
            )
        })
    )
        :
        <></>
}

export default ItemInCart;