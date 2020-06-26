import { SFC } from 'react'
import { Badge, Icon, Button } from 'antd'
import { BookingMenuFragment } from 'types/schema-types'

type Props = {
  data: BookingMenuFragment | undefined
  controlDrawer: (visible: boolean) => void
  controlModal: (visible: boolean) => void
}

const BookingMenu: SFC<Props> = ({ controlDrawer, controlModal, data }) => (
  <span style={{ marginRight: 24 }}>
    {
      data && data.bookings.length
      ? (
          <Badge count={data.bookings[0].items.length}>
            <Icon onClick={() => controlDrawer(true)}  type="shopping-cart" style={{ fontSize: 32, color: '#FFF' }}/>
          </Badge>
        )
      : data && !data.bookings.length
      ? (
          <Button type="primary" onClick={() => controlModal(true)}>
            Buat Booking
          </Button>
        )
      : null
    }
  </span>
)

export default BookingMenu