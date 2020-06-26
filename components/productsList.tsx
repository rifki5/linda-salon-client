import { Component } from 'react'
import { Query } from 'react-apollo'
import { DataUserForProductFragment, FilterProductByDateGivenQuery, FilterProductByDateGivenQueryVariables } from 'types/schema-types'
import ProductCard from './productCard'
import FILTER_PRODUCT_QUERY3 from 'queries/product/filterProductByDateGivenQ.graphql'
import NoData from './noData'
import { Row, Pagination, Modal } from 'antd'
import dateNow from 'utilities/dateNow'

export class ProductListsQ extends Query<FilterProductByDateGivenQuery, FilterProductByDateGivenQueryVariables> {}

type State = typeof initialState

type Props = {
  productPerPage: number
  tag: "BARANG" | "PAKETWEDDING",
  dataFragment: DataUserForProductFragment | undefined
}

const ProductsWrapper: React.SFC<{}> = ({ children }) => (
  <Row
    type="flex"
    gutter={24}
  >
    {children}
  </Row>
)

const initialState = {
  currentPage: 1,
  name: '',
  deskription: '',
  modalVisible: false
}

class ProductLists extends Component<Props, State> {

  readonly state: State = initialState

  private pageChange = (page: number) => {
    this.setState({
      currentPage: page
    })
  }

  private handleClick = (name: string, deskription: string) => {
    this.setState({
      name,
      deskription,
      modalVisible: true
    })
  }

  private handleCancel = () => {
    this.setState({
      modalVisible: false
    })
  }
  
  render() {
    const { currentPage, name, deskription, modalVisible } = this.state
    const { productPerPage, tag, dataFragment } = this.props
    const isBookingAvaible = dataFragment && dataFragment.bookings.length !== 0
    const startDate = isBookingAvaible ? dataFragment!.bookings[0].startDate : dateNow
    const endDate = isBookingAvaible ? dataFragment!.bookings[0].endDate : dateNow
    const idCreatedBooking = isBookingAvaible ? dataFragment!.bookings[0].id : undefined
    const first = productPerPage
    const skip = currentPage === 1 
        ? 0 
        : (currentPage - 1) * productPerPage 
    return (
      <ProductListsQ
        query={FILTER_PRODUCT_QUERY3}
        variables={{ first, skip, tag, startDate, endDate } as any}
        fetchPolicy="network-only"
      >
        {({ data, error, refetch }) => {
          if (
            !error
            && data
            && data.filterProductByDateGiven
            && data.filterProductByDateGiven.edges
          ) {
            return (
              <>
              <ProductsWrapper>
                {data.filterProductByDateGiven.edges.map(product => (
                  <ProductCard
                    handleClick={(name, deskription) => this.handleClick(name, deskription)}
                    idCreatedBooking={idCreatedBooking}
                    key={product!.node.id}
                    product={product!.node}
                  />
                ))}
              </ProductsWrapper>
              <Modal 
                centered
                title={`Deskripsi ${name}`}
                footer={null}
                visible={modalVisible}
                onCancel={this.handleCancel}
              >
                <div dangerouslySetInnerHTML={{ __html: deskription}}></div>
              </Modal>
              <Row type="flex" justify="center">
                <Pagination
                  style={{ margin: "24px 0"}}
                  total={data.filterProductByDateGiven.aggregate.count}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  pageSize={productPerPage}
                  defaultPageSize={10}
                  current={currentPage}
                  onChange={(page: number) => {
                    this.pageChange(page)
                    refetch({
                      first,
                      skip,
                      startDate,
                      endDate,
                      tag
                    } as any)
                  }}
                />
              </Row>
              </>
            )
          } else {
            return (
              <ProductsWrapper>
                <NoData />
              </ProductsWrapper>
            )
          }
        }}
      </ProductListsQ>
    )
  }
}

export default ProductLists