import { gql } from '@apollo/client';

export const GET_START_PRODUCTS = gql`
  query Query($index: Int!) {
    startProducts(startIndex: $index) {
      Varenavn
      Varetype
      Varenummer
      Produsent
      Volum
      Pris
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query Query($matchedString: String!) {
    searchProducts(searchSequence: $matchedString) {
      Varenavn
      Varetype
      Varenummer
      Produsent
      Volum
      Pris
    }
  }
`;

export const FILTER_PRODUCTS = gql`
  query Query($typer: [String]!) {
    filterProducts(varetyper: $typer) {
      Varenavn
      Varetype
      Varenummer
      Produsent
      Volum
      Pris
    }
  }
`;