import { ApolloClient, InMemoryCache, gql, NormalizedCacheObject } from '@apollo/client';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const makeQuery = () => {
  // return client.mutate({
  //   mutation: gql`
  //     mutation Mutation {
  //       createCat(name: "henrik-katt") {
  //         name
  //       }
  //     }
  //   `,
  // });
  return client.query({
    query: gql`
      query Query {
        cats {
          id
          name
        }
      }
    `,
  });
};