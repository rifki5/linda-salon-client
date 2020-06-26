import React from 'react' 
import ProductLists from 'components/productsList'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { PageInfo } from 'utilities/pageInfo'
import { MeQuery } from 'types/schema-types'
import { UserLayoutWithProvider, UserLayoutConsumer } from 'layout/layoutUser'
import { Layout } from 'antd'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery,
  pageInfo: PageInfo
}

const PRODUCT_PER_PAGE = 12

class PaketNikah extends React.Component<Props> {
  static async getInitialProps (context: NextContextNewContext) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    return {
      loggedInUser
    }
  }

  render() {
    const { loggedInUser } = this.props 
    return (
      <>
      <UserLayoutWithProvider
        idUser={loggedInUser && loggedInUser.me ? loggedInUser.me.id : undefined}
      >
        <UserLayoutConsumer>
          {( appProvider ) => {
            if ( appProvider ) {
              return (
                <Layout.Content style={{ marginTop: 110, padding: "50px 50px", background: "#FFF"}}>
                  <ProductLists
                    productPerPage={PRODUCT_PER_PAGE}
                    tag="PAKETWEDDING"
                    dataFragment={appProvider.dataUserForProductFilter}
                  />
                </Layout.Content>
              )
            }
          }}
        </UserLayoutConsumer>
      </UserLayoutWithProvider>
      </>
    )
  }
}

export default PaketNikah

 