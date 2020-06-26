import { SFC } from 'react'
import { List, Row } from 'antd'
import toRupiah from 'utilities/toRupiah'

type Props = {
  dataItem: any
  totalPrice: number
}

const ListBookingList: SFC<Props> = ({ dataItem, totalPrice }) => (
  <List
    size="small"
    header="Items"
    bordered
    className="list-booking"
    dataSource={dataItem}
    renderItem={ (item : any) =>
      <List.Item
        key={item.id}
      >
        <List.Item.Meta
          title={`${item.amount} x ${item.product.name}`}
        />
        <div>
          {toRupiah(item.amount * item.product.price)}
        </div>
      </List.Item>
    }
    footer={
      <Row
        type="flex"
        justify="space-between"
      >
        <span><b>total</b></span>
        <span><b>{`${toRupiah(totalPrice)}`}</b></span>
      </Row>
    }
  />
)

export default ListBookingList