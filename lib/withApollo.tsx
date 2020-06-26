import React from 'react'
import initApollo from './initApollo'
import cookie from 'cookie'
import Head from 'next/head'
import { getDataFromTree } from 'react-apollo'
import { NormalizedCacheObject, ApolloClient } from 'apollo-boost'
import { AppComponentContext } from 'next/app'
import { IncomingMessage } from 'http';
import { NextContext } from 'next';

declare let process: {
  browser: any
}

type Props = {
  apolloState: NormalizedCacheObject
}

export type NextContextNewContext = {
  apolloClient: ApolloClient<any>
} & NextContext

function parseCookies (req?: IncomingMessage | undefined, options = {}) {
  return cookie.parse(
    req ? (req.headers.cookie as string) || '' : document.cookie,
    options
  )
}

const assignContext = (ctx: NextContextNewContext, apollo: ApolloClient<NormalizedCacheObject>) => {
  ctx.apolloClient = apollo
}

export default (App) => {
  return class WithData extends React.Component<Props> {
    static displayName = `WithData(${App.displayName})`
    
    static async getInitialProps(ctx: AppComponentContext) {
      const { Component, router, ctx: { req, res } } = ctx

      const apollo = initApollo({}, {
        getToken: () => parseCookies(req).token
      })

      assignContext(ctx.ctx as any, apollo)

      let appProps = {}

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx)
      }

      if (res && res.finished) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        return {}
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      if (!process.browser) {
        try {
          // Run all GraphQL queries
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          )
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          // Handle them in components via the data.error prop:
          // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
          console.error('Error while running `getDataFromTree`', error)
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind()
      }

      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract()
      return {
        ...appProps,
        apolloState,
      }
    }

    private apolloClient = initApollo(this.props.apolloState, {
      getToken: () => parseCookies().token
    })

    render () {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }
}
