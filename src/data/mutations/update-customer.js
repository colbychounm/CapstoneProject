import { gql } from '@apollo/client';

export const MUTATION_CUSTOMER = gql`
    mutation UpdateCustomer($customer: CustomerInput!) {
        updateCustomer(customer: $customer) {
        id
        }
    }`;
