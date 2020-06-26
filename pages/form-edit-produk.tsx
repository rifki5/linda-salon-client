import { Component } from 'react'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery, ProductQuery, ProductQueryVariables } from 'types/schema-types'
import { Row } from 'antd'
import PRODUCT_QUERY from 'queries/product/product.graphql'
import FormEditProduct from 'components/formEditProduct'
import { AdminLayoutWithProvider, AdminLayoutConsumer } from 'layout/layoutAdmin'
import { Query } from 'react-apollo'
import redirect from 'lib/redirect'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery
  queryId: string
}

class QueryProduct extends Query<ProductQuery, ProductQueryVariables> {}

class FormEditProduk extends Component<Props> {
  static async getInitialProps (context: NextContextNewContext) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    const queryId = context.query.id

    if (loggedInUser && loggedInUser.me && loggedInUser.me.role === "ADMIN") {
      return {
        loggedInUser,
        queryId: queryId
      }
    } else {
      redirect(context, '/')
    }
  }

  render() {
    const { loggedInUser, queryId } = this.props
    return (
      <AdminLayoutWithProvider
        idUser={loggedInUser && loggedInUser.me ? loggedInUser.me.id : undefined}
        nameHeader="Edit / Lihat Produk"
      >
        <AdminLayoutConsumer>
          {( appProvider ) => {
            if (appProvider) {
              return (
                <Row
                  type="flex"
                  justify="center"
                  align="middle"
                >
                  <QueryProduct
                    query={PRODUCT_QUERY}
                    variables={{
                      id: queryId
                    }}
                  >
                    {({ data, error }) => {
                      if (!error && data && data.product) {
                        return (
                          <FormEditProduct 
                            data={data.product}
                            tag="BARANG"
                          />
                        )
                      }
                    }}
                  </QueryProduct>
                </Row>
              )
            }
          }}
        </AdminLayoutConsumer>
      </AdminLayoutWithProvider>
    )
  }
}

export default FormEditProduk