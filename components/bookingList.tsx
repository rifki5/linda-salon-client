import { Component } from 'react'
import { Table } from 'antd'
import { Query } from 'react-apollo'
import { SearchBookingsByUserQuery, SearchBookingsByUserQueryVariables } from 'types/schema-types'
import SEARCH_BOOKING from 'queries/booking/searchBookingsByUser.graphql'
import { format } from 'date-fns'
import NoData from './noData'
import ListBookingList from 'components/listBookingList'

type State = typeof initialState

type Props = {
  bookingPerPage: number,
  idUser: string
}

const initialState = {
  currentPage: 1
}

const columns = [
  {title: 'ID Booking', dataIndex: 'node.id', key: '1', width: 250 },
  {title: 'Start Date', dataIndex: 'node.startDate', render: (value) => format(value, 'DD-MM-YYYY'), key: '2', width: 150 },
  {title: 'End Date', dataIndex: 'node.endDate', render: (value) => format(value, 'DD-MM-YYYY'), key: '3', width: 150 },
  {title: 'No WhatsApp', dataIndex: 'node.noWhatsApp', key: '4', width: 150 },
  {title: 'Status', dataIndex: 'node.status', key: '5', width: 150 },
]

class BookingsQuery extends Query<SearchBookingsByUserQuery, SearchBookingsByUserQueryVariables> {}

class BookingList extends Component<Props, State> {
  readonly state: State = initialState

  private pageChange = (page: number) => {
    this.setState({
      currentPage: page
    })
  }

  render() {
    const { idUser, bookingPerPage } = this.props
    const { currentPage } = this.state
    const first = bookingPerPage
    const skip = currentPage === 1
      ? 0
      : (currentPage - 1) * bookingPerPage

    return (
      <BookingsQuery
        query={SEARCH_BOOKING}
        variables={{
          first,
          skip,
          idUser
        }}
        fetchPolicy="network-only"
      >
        {({ data, error, refetch }) => {
          if ( 
            !error 
            && data 
            && data.searchBookingsByUser 
            && data.searchBookingsByUser.edges 
          ) {
            const dataResult = data.searchBookingsByUser.edges
              ? data.searchBookingsByUser.edges
              : undefined
            const totalData = data.searchBookingsByUser.aggregate.count
            return (
              <Table
                dataSource={dataResult}
                columns={columns}
                rowKey={(record: any) => record.node.id}
                pagination={{
                  style: { margin: "24px 0" },
                  position: "bottom",
                  defaultPageSize: 10,
                  current: currentPage,
                  pageSize: bookingPerPage,
                  showTotal : (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  total: totalData,
                  onChange: (page: number) => {
                    this.pageChange(page)
                    refetch({
                      idUser,
                      first,
                      skip
                    })
                  }
                }}
                expandedRowRender={(record: any) => {
                  const totalPrice = record.node.items ? record.node.items.reduce((acc, curr) => {
                    return acc + (curr.amount * curr.product.price)
                  }, 0) : 0
                  return (
                    <div>
                      <div style={{
                        padding: "0px 16px 16px"
                      }}>
                        <b>Address: </b>
                        {`  ${record.node.address}`}
                      </div>
                      <div style={{
                        padding: "0px 16px 16px"
                      }}>
                        <b>Message: </b>
                        {`  ${record.node.message}`}
                      </div>
                      <ListBookingList 
                        dataItem={record.node.items}
                        totalPrice={totalPrice}
                      />
                    </div>
                  )
                }}
              >
              </Table>
            )
          } else return <NoData />
        }}
      </BookingsQuery>
    )
  }
} 

export default BookingList