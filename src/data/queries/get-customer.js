import { gql } from '@apollo/client';

export const GET_CUSTOMER = gql`
    query Customer($customerCustomerId2: ID!) {
        customer(customerId: $customerCustomerId2) {
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
    }`;