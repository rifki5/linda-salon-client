import { Component } from 'react'
import FormAddProduct from 'components/formAddProduct'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery } from 'types/schema-types'
import { Row } from 'antd'
import { AdminLayoutWithProvider, AdminLayoutConsumer } from 'layout/layoutAdmin'
import redirect from 'lib/redirect'
import '../styles/index.less'


type Props = {
  loggedInUser: MeQuery
}

class FormTambahProduk extends Component<Props> {
  static async getInitialProps (context: NextContextNewContext) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)

    if (loggedInUser && loggedInUser.me && loggedInUser.me.role === "ADMIN") {
      return {
        loggedInUser
      }
    } else {
      redirect(context, '/')
    }
  }

  render() {
    const { loggedInUser } = this.props
    return (
      <AdminLayoutWithProvider
        idUser={loggedInUser && loggedInUser.me ? loggedInUser.me.id : undefined}
        nameHeader="Tambah Produk"
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
                  <FormAddProduct
                    tag="BARANG"
                  />
                </Row>
              )
            }
          }}
        </AdminLayoutConsumer>
      </AdminLayoutWithProvider>
    )
  }
}

export default FormTambahProduk