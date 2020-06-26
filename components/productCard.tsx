import React from 'react'
import { MeQuery } from 'types/schema-types'
import { Card, Col } from 'antd'
import toRupiah from 'utilities/toRupiah'
import ActionCard from 'components/actionCard'
import { ApolloConsumer } from 'react-apollo'
import ME_QUERY from 'queries/user/meQ.graphql'

type Props = {
  idCreatedBooking: string | undefined
  product: any,
  handleClick: (name: string, deskription: string) => void
}

const ProductCard: React.SFC<Props> = ({ handleClick, product, idCreatedBooking }) => (
  <Col
    xs={24} 
    md={12}
    lg={6}
    style={{ marginBottom: 24, padding: "0px 12px"}}
    key={product.id}
  >
    <ApolloConsumer>
      {( client ) => {
        let ProductAvaibleInItem = false
        if ( idCreatedBooking ) {
          const dataMe = client.readQuery<MeQuery>({ query: ME_QUERY })
          const dataProductFromMe = dataMe!.me.bookings[0].items.filter(item => item.product.id === product.id)
          ProductAvaibleInItem = dataProductFromMe.length !== 0
        }
        return (
          <Card
            onDoubleClick={() => handleClick(product.name, product.description)}
            hoverable
            cover={product.photo && product.photo.url 
              ? <img alt="product-cover" src={product.photo.url} />
              : <img alt="product-cover" src="../static/images/suzy.jpg" />}
            actions={
              idCreatedBooking && product.stock > 0  && !ProductAvaibleInItem
                ? [
                    <ActionCard 
                      min={1}
                      max={product.stock}
                      defaultValue={1}
                      idProduct={product.id}
                      idBooking={idCreatedBooking}
                    />
                  ] 
                : undefined
            }
          >
            <Card.Meta
              title={product.name}
              description={
                <div>
                  <div>
                    Stok: {product.stock}
                  </div>
                  <div>
                    Harga: {toRupiah(product.price)}
                  </div>
                </div>
              }
            />
          </Card>
        )
      }}
    </ApolloConsumer>
  </Col>   
)

export default ProductCard