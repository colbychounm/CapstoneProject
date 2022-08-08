import { gql } from '@apollo/client';

export const MUTATION_PRODUCT = gql`
    mutation UpdateProduct($updateProductProduct2: UpdateProductInput!) {
        updateProduct(product: $updateProductProduct2) {
        id
        }
    }`;
