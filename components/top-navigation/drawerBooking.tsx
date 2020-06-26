import { SFC } from 'react'
import { Drawer, Button, message } from 'antd' 
import { Mutation } from 'react-apollo'
import { BookingMenuFragment, DeleteBookingMutation, DeleteBookingMutationVariables, MeQuery } from 'types/schema-types'
import REMOVE_BOOKING from 'queries/booking/deleteBookingM.graphql'
import FormDrawer from 'components/top-navigation/formDrawer'
import ME_QUERY3 from 'queries/user/meQ.graphql'

class RemoveFromBooking extends Mutation<DeleteBookingMutation, DeleteBookingMutationVariables> {}

type Props = {
  controlDrawer: (visible: boolean) => void
  isVisible: boolean
  data: BookingMenuFragment
}

const DrawerBooking: SFC<Props> = ({ controlDrawer, isVisible, data }) => (
  <Drawer
    title={
      <div>
        <span>Booking</span>
        <span>
          <RemoveFromBooking
            mutation={REMOVE_BOOKING}
            onCompleted={() => message.success('success deleted')}
          >
            {(remove) => (
              <Button
                style={{ marginLeft: 24 }}
                type="ghost"
                onClick={() => {
                  remove({
                    variables: {
                      id: data.bookings[0].id
                    },
                    update: ( client, result ) => {
                      const readQuery = client.readQuery<MeQuery>({ query: ME_QUERY3 })
                      const { data } = result
                      const dataResult = data && data.deleteBooking ? data.deleteBooking : undefined
                      if ( readQuery && dataResult ) {
                        const bookings = readQuery.me.bookings.filter(booking => booking.id !== dataResult.id)
                        client.writeQuery<MeQuery>({
                          query: ME_QUERY3,
                          data: {
                            me: { ...readQuery.me, bookings }
                          }
                        })
                      }
                    }
                  }).then(data => {
                    if (data) {
                      controlDrawer(false)
                    }
                  })
                }}
              >
                Hapus Booking
              </Button>
            )}
          </RemoveFromBooking>
        </span>
      </div>
    }
    placement="right"
    closable
    onClose={() => controlDrawer(false)}
    visible={isVisible}
    width={420}
  >
    <FormDrawer
      hideDrawer={(visible: boolean) => controlDrawer(visible)}
      data={data}
    />
  </Drawer>
)

export default DrawerBooking