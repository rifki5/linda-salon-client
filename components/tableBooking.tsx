import { Component } from 'react'
import {
  DeleteBookingMutation,
  DeleteBookingMutationVariables,
  DeleteManyBookingMutation,
  DeleteManyBookingMutationVariables,
  BookingConnectionQuery,
  BookingConnectionQueryVariables,
} from 'types/schema-types'
import { Table, Button, Row, Select, message } from 'antd'
import NoData from './noData'
import { Query, compose, graphql, MutationFunc } from 'react-apollo'
import DELETE_BOOKING from 'queries/booking/deleteBookingM.graphql'
import DELETE_MANY_BOOKING from 'queries/booking/deleteManyBooking.graphql'
import BOOKING_CONNECTION_QUERY from 'queries/booking/bookingConnection.graphql'
import Router from 'next/router'

const Option = Select.Option

type Props = {
  productPerPage: number,
  deleteBooking: MutationFunc<DeleteBookingMutation, DeleteBookingMutationVariables>,
  deleteManyBooking: MutationFunc<DeleteManyBookingMutation, DeleteManyBookingMutationVariables>
}

type State = typeof initialState

const initialState = {
  selectedAction: '' as 'Delete' | 'Edit' | 'DeleteAll',
  selectedRowIds: [] as any[],
  currentPage: 1
}

const columns = [{
  key: 'node.id',
  title: 'Id',
  dataIndex: 'node.id',
}, {
  title: 'User Booking',
  dataIndex: 'node.userBooking.name',
}, {
  title: 'No WhatsApp',
  dataIndex: 'node.noWhatsApp',
}, {
  title: 'Status',
  dataIndex: 'node.status',
}];

class BookingListsQ extends Query<BookingConnectionQuery, BookingConnectionQueryVariables> {}

class TableBookings extends Component<Props, State> {

  readonly state: State = initialState

  private pageChange = (page: number) => {
    this.setState({
      currentPage: page
    })
  }

  private onSelectChange = (record: any) => {
    const { selectedRowIds } = this.state
    const isIdHasAdded = selectedRowIds.indexOf(record.node.id) >= 0
    this.setState((prev) => ({
      selectedRowIds: isIdHasAdded 
        ? prev.selectedRowIds.filter(selectedRowId => selectedRowId !== record.node.id) 
        : prev.selectedRowIds.concat(record.node.id),
      selectedAction: '' as any
    }))
  }

  private handleChange = (value: State['selectedAction']) => {
    this.setState({
      selectedAction: value
    })
  }

  private handleAction = () => {
    const { selectedAction, selectedRowIds, currentPage } = this.state
    const { deleteBooking, deleteManyBooking, productPerPage } = this.props
    const first = productPerPage
    const skip = currentPage === 1 
        ? 0 
        : (currentPage - 1) * productPerPage 
    const refetchQueries = [{
      query: BOOKING_CONNECTION_QUERY,
      variables: {
        first,
        skip,
      }
    }]
    switch (selectedAction) {
      case "Delete" :
        deleteBooking({
          variables: {
            id: selectedRowIds[0]
          },
          refetchQueries
        }).then(() => {
          message.success('sukses hapus booking')
          this.setState(initialState)
        }).catch(() => {
          message.error('gagal hapus booking')
        })
        break
      case "Edit" :
        Router.push({ pathname: "/form-edit-booking", query: {id: selectedRowIds[0]}})
        break
      case "DeleteAll" :
        deleteManyBooking({
          variables: {
            ids: selectedRowIds
          },
          refetchQueries
        }).then(() => {
          message.success('sukses hapus booking')
          this.setState(initialState)
        }).catch(() => {
          message.error('gagal hapus booking')
        })
        break
    }
  }

  private onSelectAll = (selected: boolean, selectedRows: any[]) => {
    if (selected) {
      const selected = selectedRows.map(selected => selected.node.id)
      this.setState({
        selectedRowIds: selected,
        selectedAction: '' as any
      })
    } else {
      this.setState({
        selectedRowIds: []
      })
    }
  }

  render() {
    const { productPerPage } = this.props
    const { selectedRowIds, currentPage, selectedAction } = this.state
    const first = productPerPage
    const skip = currentPage === 1 
        ? 0 
        : (currentPage - 1) * productPerPage 
    const rowSelection = {
      onSelect: this.onSelectChange,
      onSelectAll: this.onSelectAll,
    }
    const selectedIdsEqual0 = selectedRowIds.length === 0
    const selectedIdsEqualMoreThan1 = selectedRowIds.length > 1
    return (
      <>
        <BookingListsQ
          query={BOOKING_CONNECTION_QUERY}
          variables={{
            first: productPerPage,
            skip
          }}
        >
          {({ data, error, refetch, loading }) => {
            if (
              !error
              && data
              && data.bookingConnection
              && data.bookingConnection.edges
            ) {
              const resultData = data.bookingConnection.edges
              const totalData = data.bookingConnection.aggregate.count
              return (
                <>
                  <Row type="flex" justify="end" style={{ marginBottom: 16 }}>
                    <span>
                      <Select  placeholder="Pilih Aksi" style={{ width: 120, marginRight: 16 }} onChange={this.handleChange}>
                        <Option value="Edit" disabled={Boolean(selectedIdsEqual0 || selectedIdsEqualMoreThan1)}>Edit / Lihat</Option>
                        <Option value="Delete" disabled={Boolean(selectedIdsEqual0 || selectedIdsEqualMoreThan1)}>Hapus</Option>
                        <Option value="DeleteAll" disabled={!selectedIdsEqualMoreThan1}>Hapus semua</Option>
                      </Select>
                      <Button
                        type="primary"
                        onClick={this.handleAction}
                        disabled={!(selectedRowIds.length !== 0 && selectedAction !== '' as any)}
                      > 
                        Jalankan
                      </Button>
                    </span>
                  </Row>
                  <Table 
                    rowSelection={rowSelection}
                    rowKey={record => record!.node.id}
                    columns={columns}
                    loading={loading}
                    dataSource={resultData as any}
                    pagination={{
                      style: { margin: "24px 0" },
                      position: "bottom",
                      defaultPageSize: 10,
                      current: currentPage,
                      pageSize: productPerPage,
                      showTotal : (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      total: totalData,
                      onChange: (page: number) => {
                        this.pageChange(page)
                        refetch({
                          first,
                          skip
                        })
                      }
                    }}
                  />
                </>
              )
            } else {
              return (
                <NoData />
              )
            }
          }}
        </BookingListsQ>
      </>
    )
  }
}

export default compose(
  graphql<{}, DeleteBookingMutation, DeleteBookingMutationVariables, {}>(DELETE_BOOKING, {
    name: "deleteBooking"
  }),
  graphql<{}, DeleteManyBookingMutation, DeleteManyBookingMutationVariables, {}>(DELETE_MANY_BOOKING, {
    name: "deleteManyBooking"
  })
)(TableBookings)