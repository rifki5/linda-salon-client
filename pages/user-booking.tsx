import React from 'react' 
import BookingList from 'components/bookingList'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery } from 'types/schema-types'
import { Layout } from 'antd' 
import { UserLayoutWithProvider, UserLayoutConsumer } from 'layout/layoutUser'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery,
}

const BOOKING_PER_PAGE = 12

class UserBooking extends React.Component<Props> {
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
            if ( appProvider && appProvider.idUser ) {
              return (
                <Layout.Content style={{ marginTop: 110, padding: "50px 50px", background: "#FFF"}}>
                  <BookingList
                    bookingPerPage={BOOKING_PER_PAGE}
                    idUser={appProvider.idUser}
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

export default UserBooking

 