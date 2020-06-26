import { Component } from 'react'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery, BookingQuery, BookingQueryVariables } from 'types/schema-types'
import { Row } from 'antd'
import BOOKING_QUERY from 'queries/booking/booking.graphql'
import FormEditBooking from 'components/formEditBooking'
import { AdminLayoutWithProvider, AdminLayoutConsumer } from 'layout/layoutAdmin'
import { Query } from 'react-apollo'
import redirect from 'lib/redirect'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery
  queryId: string
}

class QueryBooking extends Query<BookingQuery, BookingQueryVariables> {}

class FormEditBookingComp extends Component<Props> {
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
        nameHeader="Edit / Lihat Booking"
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
                  <QueryBooking
                    query={BOOKING_QUERY}
                    variables={{
                      id: queryId
                    }}
                  >
                    {({ data, error }) => {
                      if (!error && data && data.booking) {
                        return (
                          <FormEditBooking
                            data={data.booking}
                          />
                        )
                      } else {
                        return null
                      }
                    }}
                  </QueryBooking>
                </Row>
              )
            }
          }}
        </AdminLayoutConsumer>
      </AdminLayoutWithProvider>
    )
  }
}

export default FormEditBookingComp