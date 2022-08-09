import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
    mutation AddItemToCart($customerId: ID!, $item: CartItemInput!) {
        addItemToCart(customerId: $customerId, item: $item) {
        id
        }
    }
`;