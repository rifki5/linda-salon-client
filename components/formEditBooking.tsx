import { Component } from 'react'
import { Form, Input, message, Button, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { graphql, compose, MutationFunc } from 'react-apollo'
import { BookingQuery, UpdateStatusBookingMutation, UpdateStatusBookingMutationVariables } from 'types/schema-types'
import UPDATE_STATUS_BOOKING from 'queries/booking/updateStatusBooking.graphql'
import hasErrors from 'utilities/hasError'
import Router from 'next/router'
import { format } from 'date-fns'
import ListBookingList from 'components/listBookingList';

type FuncMutation = {
  updateStatusBooking: MutationFunc<UpdateStatusBookingMutation, UpdateStatusBookingMutationVariables>,
}

type Props = {
  data: BookingQuery['booking']
} & FormComponentProps & FuncMutation

const FormItem = Form.Item

class FormEditBooking extends Component<Props, {}> {

  componentDidMount() {
    const { form, data } = this.props 
    // To disabled submit button at the beginning.
    form.validateFields()
  
    form.setFieldsValue({
      startDate: format(data!.startDate, "DD-MM-YYYY"),
      endDate: format(data!.endDate!, "DD-MM-YYYY"),
      address: data!.address,
      userBooking: data!.userBooking!.name,
      userRole: data!.userBooking!.role,
      status: data!.status,
      message: data!.message,
      noWhatsApp: data!.noWhatsApp
    })
  }

  private handleSubmit = (e) => {
    e.preventDefault()
    const { updateStatusBooking, form, data } = this.props

    form.validateFields((err, fieldsValue) => {
      if (!err) {
        updateStatusBooking({
          variables: {
            status: fieldsValue['status'],
            idBooking: data!.id
          }
        }).then(() => {
          message.success('Berhasil update')
          Router.push('/data-booking')
        }
        ).catch(() => 
          message.error('error update')
        )
      }
    })
  }
  
  render() {
    const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form
    const statusError = isFieldTouched('status') && getFieldError('status')
    const { items } = this.props.data!
    const totalPrice = items ? items.reduce((acc, curr) => {
      return acc + (curr.amount * curr.product.price)
    }, 0) : 0
    return (
      <Form
        layout="vertical"
        style={{ width: 480 }}
        onSubmit={this.handleSubmit}
      >
        <FormItem 
          label="Status"
          validateStatus={statusError ? 'error' : 'success'}
          help={statusError || ''}
        >
          {getFieldDecorator('status', {
            rules: [{ required: true, message: 'tolong masukkan status!' }],
          })(
            <Select style={{ width: 120, marginRight: 16 }}>
              <Select.Option value="SEND" >SEND</Select.Option>
              <Select.Option value="PROCCESS" >PROCCESS</Select.Option>
              <Select.Option value="SUCCESS" >SUCCESS</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem 
          label="Tanggal Mulai"
        >
          {getFieldDecorator('startDate', {})(
            <Input type="text" readOnly />
          )}
        </FormItem>
        <FormItem 
          label="Tanggal Selesai"
        >
          {getFieldDecorator('endDate', {})(
            <Input type="text" readOnly />
          )}
        </FormItem>
        <FormItem 
          label="Alamat Tujuan"
        >
          {getFieldDecorator('address', {})(
            <Input.TextArea rows={4} readOnly />
          )}
        </FormItem>
        <FormItem 
          label="User yang booking"
        >
          {getFieldDecorator('userBooking', {})(
            <Input type="text" readOnly />
          )}
        </FormItem>
        <FormItem 
          label="Hak akses user"
        >
          {getFieldDecorator('userRole', {})(
            <Input type="text" readOnly />
          )}
        </FormItem>
        <FormItem 
          label="No WhatsApp"
        >
          {getFieldDecorator('noWhatsApp', {})(
            <Input type="number" readOnly />
          )}
        </FormItem>
        <FormItem 
          label="Pesan"
        >
          {getFieldDecorator('message', {})(
            <Input.TextArea rows={4} readOnly />
          )}
        </FormItem>
        <FormItem 
          label="No WhatsApp"
        >
          {getFieldDecorator('noWhatsApp', {})(
            <Input type="number" readOnly />
          )}
        </FormItem>
        <FormItem>
          <ListBookingList  
            dataItem={items}
            totalPrice={totalPrice}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} className="button-submit-login">
            Update
          </Button>
        </FormItem>
        
      </Form>
    )
  }
}

const WithCompose = compose(
  graphql<{}, UpdateStatusBookingMutation, UpdateStatusBookingMutationVariables, {}>(UPDATE_STATUS_BOOKING,{
    name: 'updateStatusBooking'
  }),
  Form.create({}),
)(FormEditBooking)

export default WithCompose