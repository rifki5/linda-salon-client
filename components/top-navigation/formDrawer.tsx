import { Component } from 'react'
import { Form, Input, Button, List, Row, message, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { 
  RemoveItemFromBookingMutation,
  RemoveItemFromBookingMutationVariables,
  SendBookingMutation,
  SendBookingMutationVariables,
  BookingMenuFragment,
  MeQuery,
} from 'types/schema-types'
import { Mutation, MutationFn } from 'react-apollo'
import SEND_BOOKINGS from 'queries/booking/sendBookingM.graphql'
import REMOVE_ITEM from 'queries/booking/removeItemFromBookingM.graphql'
import ME_QUERY from 'queries/user/meQ.graphql'
import toRupiah from 'utilities/toRupiah'
import { format } from 'date-fns'

type Props = {
  hideDrawer: (visible:boolean) => void
  data: BookingMenuFragment
} & FormComponentProps

class SendBooking extends Mutation<SendBookingMutation, SendBookingMutationVariables> {}
class RemoveItem extends Mutation<RemoveItemFromBookingMutation, RemoveItemFromBookingMutationVariables> {}

class FormDrawer extends Component<Props, {}> {  

  componentDidMount() {
    const { setFieldsValue } = this.props.form
    const { data, form } = this.props
    form.validateFields();
    
    setFieldsValue({
      startDate: format(data.bookings[0].startDate, "DD-MM-YYYY"),
      endDate: format(data.bookings[0].endDate!, "DD-MM-YYYY")
    })
    
  }

  private hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  private handleSend = (sendBookingM: MutationFn<SendBookingMutation, SendBookingMutationVariables>) => () => {
    const { form, data, hideDrawer } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        sendBookingM({
          variables: {
            address: values.address,
            idBooking: data.bookings[0].id,
            message: values.message,
            noWhatsApp: values.noWhatsApp
          },
          update: ( client, result ) => {
            const readQuery = client.readQuery<MeQuery>({ query: ME_QUERY })
            const { data } = result
            const resultData = data && data.sendBooking ? data.sendBooking : undefined
            if ( readQuery && resultData ) {
              const bookings = readQuery.me.bookings.filter(booking => booking.id !== resultData.id)
              client.writeQuery({
                query: ME_QUERY,
                data: {
                  me: { ...readQuery.me, bookings }
                }
              })
            }
          }
        })
        .then(() => {
          hideDrawer(false)
          message.success('Berhasil kirim booking')
        })
        .catch((err) => message.error(err.message))
      }
    })
  }

  private isBookingHasItem = () => {
    return this.props.data.bookings[0].items.length !== 0
  }

  private removeItem = (removeItemM : MutationFn<RemoveItemFromBookingMutation, RemoveItemFromBookingMutationVariables>, idItem: string) => () => {
    const { bookings } = this.props.data
    removeItemM({
      variables: {
      idBooking: bookings[0].id,
      idItem
    }
    }).then(() => {
      if (this.isBookingHasItem()) {
        return this.setState({
          buttonDisable: false
        }) 
      } else {
        return this.setState({
          buttonDisable: true
        })
      }
    })
  }
  
  render() {
    const { bookings } = this.props.data
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const sumAll = bookings[0].items.reduce((acc, curr) => {
      return acc + (curr.amount * curr.product.price)
    }, 0)
    const addressError = isFieldTouched('address') && getFieldError('address');
    const noWhatsAppError = isFieldTouched('noWhatsApp') && getFieldError('noWhatsApp');
    const messageAppError = isFieldTouched('message') && getFieldError('message');
 
    return (
      <div>
        <div style={{ marginBottom: '8px' }}>
          <RemoveItem
            mutation={REMOVE_ITEM}
          >
            {( removeItemM ) => (
              <List
                size="small"
                header="Semua item"
                bordered
                dataSource={bookings[0].items}
                renderItem={item =>
                  (
                    <List.Item  
                      key={item.id}
                      actions={[
                        <a 
                          style={{color: "red"}}
                          onClick={() => this.removeItem(removeItemM, item.id)()}>
                          x
                        </a>
                      ]}
                    >
                      <List.Item.Meta
                        title={`${item.amount} x ${item.product.name}`}
                      />
                      <div>{toRupiah(item.amount * item.product.price)}</div>
                    </List.Item>
                  )
                }
                footer={
                  <Row type="flex" justify="space-between">
                    <span><b>total</b></span>
                    <span style={{ marginRight: '63px' }}><b>{`${toRupiah(sumAll)}`}</b></span>
                  </Row>
                }
              />
            )}
          </RemoveItem>
        </div>
        <Form style={{ marginBottom: 64 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tanggal Mulai">
                {getFieldDecorator('startDate', {})(<Input readOnly />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tanggal Selesai">
                {getFieldDecorator('endDate', {})(<Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                label="Alamat"
                validateStatus={addressError ? 'error' : 'success'}
                help={addressError || ''}
              >
                {getFieldDecorator('address', {
                  rules: [{
                    required: true, message: 'masukkan pesan'
                  }]
                })(<Input.TextArea rows={4} />)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item 
                label="Nomor WhatsApp"
                validateStatus={noWhatsAppError ? 'error' : 'success'}
                help={noWhatsAppError || ''}
              >
                {getFieldDecorator('noWhatsApp', {
                  rules: [{
                    required: true, message: 'maskukkan nomor WhatsApp'
                  }]
                })(<Input type="number" max={12}/>)}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Pesan"
                validateStatus={messageAppError ? 'error' : 'success'}
                help={messageAppError || ''}
              >
                {getFieldDecorator('message', {
                  rules: [{
                    required: false, message: 'maskukkan pesan'
                  }]
                })(<Input.TextArea rows={4}/>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'center',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        > 
          <SendBooking
            mutation={SEND_BOOKINGS}
          >
            {( sendBookingM ) => (
              <Button 
                disabled={this.hasErrors(getFieldsError())}
                onClick={() => this.handleSend(sendBookingM)()}
                type="primary"
              >
                Kirim
              </Button>
            )}
          </SendBooking>
          
        </div>
      </div>
    )
  }
}

export default Form.create()(FormDrawer)