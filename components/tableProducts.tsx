import { Component } from 'react'
import {
  DeleteProductMutation,
  DeleteProductMutationVariables,
  DeleteManyProductMutation,
  DeleteManyProductMutationVariables
} from 'types/schema-types'
import { Table, Button, Row, Select, message } from 'antd'
import { ProductListsQ } from 'components/productsList'
import FILTER_PRODUCT_QUERY3 from 'queries/product/filterProductByDateGivenQ.graphql'
import dateNow from 'utilities/dateNow'
import NoData from './noData'
import { compose, graphql, MutationFunc } from 'react-apollo'
import DELETE_PRODUCT from 'queries/product/deleteProduct.graphql'
import DELETE_MANY_PRODUCT from 'queries/product/deleteManyProduct.graphql'
import Link from 'next/link'
import Router from 'next/router'

const Option = Select.Option

type Props = {
  productPerPage: number,
  tag: "BARANG" | "PAKETWEDDING",
  deleteProduct: MutationFunc<DeleteProductMutation, DeleteProductMutationVariables>,
  deleteManyProduct: MutationFunc<DeleteManyProductMutation, DeleteManyProductMutationVariables>
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
  title: 'Stok',
  dataIndex: 'node.stock',
}];

class TableProducts extends Component<Props, State> {

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
    const { deleteProduct, deleteManyProduct, productPerPage, tag } = this.props
    const first = productPerPage
    const skip = currentPage === 1 
        ? 0 
        : (currentPage - 1) * productPerPage 
    const refetchQueries = [{
      query: FILTER_PRODUCT_QUERY3,
      variables: {
        first,
        skip,
        tag,
        startDate: dateNow,
        endDate: dateNow
      }
    }]
    switch (selectedAction) {
      case "Delete" :
        deleteProduct({
          variables: {
            id: selectedRowIds[0]
          },
          refetchQueries
        }).then(() => {
          message.success('sukses hapus produk')
          this.setState(initialState)
        }).catch(() => {
          message.error('gagal hapus produk')
        })
        break
      case "Edit" :
        Router.push({ pathname: "/form-edit-produk", query: {id: selectedRowIds[0]}})
        break
      case "DeleteAll" :
        deleteManyProduct({
          variables: {
            ids: selectedRowIds
          },
          refetchQueries
        }).then(() => {
          message.success('sukses hapus produk')
          this.setState(initialState)
        }).catch(() => {
          message.error('gagal hapus produk')
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
    const { productPerPage, tag } = this.props
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
        <ProductListsQ
          query={FILTER_PRODUCT_QUERY3}
          variables={{
            tag,
            endDate: dateNow,
            startDate: dateNow,
            first: productPerPage,
            skip
          }}
        >
          {({ data, error, refetch, loading }) => {
            if (
              !error
              && data
              && data.filterProductByDateGiven
              && data.filterProductByDateGiven.edges
            ) {
              const resultData = data.filterProductByDateGiven.edges
              const totalData = data.filterProductByDateGiven.aggregate.count
              return (
                <>
                  <Row type="flex" justify="space-between" style={{ marginBottom: 16 }}>
                    <span>
                      <Link href={tag === "BARANG" ? "/form-tambah-produk" : "/form-tambah-paket-wedding"} prefetch>
                        <Button type="default">
                          Tambah
                        </Button>
                      </Link>
                    </span>
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
                          skip,
                          startDate: dateNow,
                          endDate: dateNow,
                          tag
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
        </ProductListsQ>
      </>
    )
  }
}

export default compose(
  graphql<{}, DeleteProductMutation, DeleteProductMutationVariables, {}>(DELETE_PRODUCT, {
    name: "deleteProduct"
  }),
  graphql<{}, DeleteManyProductMutation, DeleteManyProductMutationVariables, {}>(DELETE_MANY_PRODUCT, {
    name: "deleteManyProduct"
  })
)(TableProducts)