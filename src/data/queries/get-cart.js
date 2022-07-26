import { gql } from '@apollo/client';

const variables = {
    $customerCustomerId2: "Chau"
}

export const GET_CART_ITEMS = gql`
    query Customer {
        customer(customerId: "${variables.$customerCustomerId2}") {
        id
        items {
            productId
            color
            size
            quantity
        }
        name
        location
        }
    }
`;

export const getProduct = (productId) => {
    const GET_ITEM = gql`
    query Product {
        product(id: ${productId}) {
        id
        name
        price
        stock
        colors {
            name
            hexValue
        }
        description
        categories
        pictures
        sizes
        featuringFrom
        featuringTo
        }
    }
`;
    return GET_ITEM
}

