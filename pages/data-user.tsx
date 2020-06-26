import { Component } from 'react'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery } from 'types/schema-types'
import { AdminLayoutWithProvider, AdminLayoutConsumer } from 'layout/layoutAdmin'
import TableUsers from 'components/tableUsers'
import redirect from 'lib/redirect'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery
}

class DataBooking extends Component<Props> {
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
        nameHeader="Data User"
      >
        <AdminLayoutConsumer>
          {( appProvider ) => {
            if (appProvider) {
              return (
                <TableUsers
                  userPerPage={12}
                  role="CUSTOMER"
                />
              )
            }
          }}
        </AdminLayoutConsumer>
      </AdminLayoutWithProvider>
    )
  }
}

export default DataBooking