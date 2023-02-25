import { ApolloClient,InMemoryCache } from "@apollo/client";

const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
const client = new ApolloClient({
    uri:`http://${process.env.NEXT_PUBLIC_APP_SERVER}:9000/graphql`,
    cache:new InMemoryCache(),
    defaultOptions
})

export default client;