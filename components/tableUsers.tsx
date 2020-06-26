import { Component } from 'react'
import {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  DeleteManyUserMutation,
  DeleteManyUserMutationVariables,
  UsersConnectionQuery,
  UsersConnectionQueryVariables,
  Role
} from 'types/schema-types'
import { Table, Button, Row, Select, message } from 'antd'
import USERS_CONNECTION_QUERY from 'queries/user/usersConnection.graphql'
import NoData from 'components/noData'
import { Query, compose, graphql, MutationFunc } from 'react-apollo'
import DELETE_USER from 'queries/user/deleteUser.graphql'
import DELETE_MANY_USER from 'queries/user/deleteManyUser.graphql'
import Router from 'next/router'

const Option = Select.Option

type Props = {
  userPerPage: number,
  role: Role,
  deleteUser: MutationFunc<DeleteUserMutation, DeleteUserMutationVariables>,
  deleteManyUser: MutationFunc<DeleteManyUserMutation, DeleteManyUserMutationVariables>
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
  title: 'Nama',
  dataIndex: 'node.name',
}, {
  title: 'Email',
  dataIndex: 'node.email',
}];

class UserListsQ extends Query<UsersConnectionQuery, UsersConnectionQueryVariables> {}

class TableUSers extends Component<Props, State> {

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
    const { deleteUser, deleteManyUser, userPerPage, role } = this.props
    const first = userPerPage
    const skip = currentPage === 1 
        ? 0 
        : (currentPage - 1) * userPerPage 
    const refetchQueries = [{
      query: USERS_CONNECTION_QUERY,
      variables: {
        first,
        skip,
        role
      }
    }]
    switch (selectedAction) {
      case "Delete" :
        deleteUser({
          variables: {
            id: selectedRowIds[0]
          },
          refetchQueries
        }).then(() => {
          message.success('sukses hapus user')
          this.setState(initialState)
        }).catch(() => {
          message.error('gagal hapus user')
        })
        break
      case "Edit" :
        Router.push({ pathname: "/form-edit-user", query: {id: selectedRowIds[0]}})
        break
      case "DeleteAll" :
        deleteManyUser({
          variables: {
            ids: selectedRowIds
          },
          refetchQueries
        }).then(() => {
          message.success('sukses hapus user')
          this.setState(initialState)
        }).catch(() => {
          message.error('gagal hapus user')
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
    const { userPerPage, role } = this.props
    const { selectedRowIds, currentPage, selectedAction } = this.state
    const first = userPerPage
    const skip = currentPage === 1 
        ? 0 
        : (currentPage - 1) * userPerPage 
    const rowSelection = {
      onSelect: this.onSelectChange,
      onSelectAll: this.onSelectAll,
    }
    const selectedIdsEqual0 = selectedRowIds.length === 0
    const selectedIdsEqualMoreThan1 = selectedRowIds.length > 1
    return (
      <>
        <UserListsQ
          query={USERS_CONNECTION_QUERY}
          variables={{
            role,
            first: userPerPage,
            skip
          }}
        >
          {({ data, error, refetch, loading }) => {
            if (
              !error
              && data
              && data.usersConnection
              && data.usersConnection.edges
            ) {
              const resultData = data.usersConnection.edges
              const totalData = data.usersConnection.aggregate.count
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
                      pageSize: userPerPage,
                      showTotal : (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      total: totalData,
                      onChange: (page: number) => {
                        this.pageChange(page)
                        refetch({
                          first,
                          skip,
                          role
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
        </UserListsQ>
      </>
    )
  }
}

export default compose(
  graphql<{}, DeleteUserMutation, DeleteUserMutationVariables, {}>(DELETE_USER, {
    name: "deleteUser"
  }),
  graphql<{}, DeleteManyUserMutation, DeleteManyUserMutationVariables, {}>(DELETE_MANY_USER, {
    name: "deleteManyUser"
  })
)(TableUSers)