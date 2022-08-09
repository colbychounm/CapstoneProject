import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
    query {
        products {
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