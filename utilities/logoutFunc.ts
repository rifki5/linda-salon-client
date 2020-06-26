import { ApolloClient } from 'apollo-boost'
import redirect from 'lib/redirect'
import { NextContext } from 'next'
import cookie from 'cookie'

const logoutFunc = (client: ApolloClient<any>) => {
  document.cookie = cookie.serialize('token', '', {
    maxAge: -1 // Expire the cookie immediately
  })

  client.cache.reset().then(() => {
    redirect({} as NextContext, '/')
  })
}

export default logoutFunc