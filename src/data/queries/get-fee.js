import { gql } from '@apollo/client';

export const GET_FEE = gql`
  query Fee($location: String!) {
      fee(location: $location) {
        shipping
        tax
      }
    }`;