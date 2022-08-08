import { gql } from '@apollo/client';

export const EMPTY_CART = gql`
    mutation EmptyCart($emptyCartCustomerId2: ID!) {
        emptyCart(customerId: $emptyCartCustomerId2) {
        id
        }
    }`;
