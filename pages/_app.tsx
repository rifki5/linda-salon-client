import App, { Container, AppComponentProps } from 'next/app'
import { ApolloProvider } from 'react-apollo'
import withApollo from '../lib/withApollo'
import { ApolloClient } from 'apollo-boost'

type Apollo = {
  apolloClient: ApolloClient<any>
} & AppComponentProps

class MyApp extends App<Apollo> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp as typeof MyApp)