import { gql } from '@apollo/client';

export const GET_PRODUCT = gql`
    query Product($productId: ID!) {
        product(id: $productId) {
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
    }`;