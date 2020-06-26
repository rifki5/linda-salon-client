import { ApolloClient, ApolloQueryResult } from 'apollo-boost'
import ME_QUERY4 from 'queries/user/meQ.graphql'
import { MeQuery } from 'types/schema-types'

export default (apolloClient: ApolloClient<any>) => (
  apolloClient.query({
    query: ME_QUERY4
  }).then(({ data } : ApolloQueryResult<MeQuery>) => {
    return { loggedInUser: data as MeQuery } 
  }).catch(() => {
    // Fail gracefully
    return { loggedInUser: null }
  })
)