import { Component } from 'react'
import { InputNumber, Button, Divider } from 'antd'
import { MutationFn, Mutation } from 'react-apollo'
import { AddProductToBookingMutation, AddProductToBookingMutationVariables } from 'types/schema-types'
import ADD_PRODUCT_TO_BOOKING from 'queries/booking/addProductToBookingM.graphql'

type Props = {
  min: number,
  max: number,
  defaultValue: number,
  idProduct: string,
  idBooking: string,
}

type State = typeof initialState

const initialState = {
  amount: 1
}

class AddProductToBooking extends Mutation<AddProductToBookingMutation, AddProductToBookingMutationVariables>{}

class ActionCard extends Component<Props, State> {
  state: State = initialState

  handleChange = (value:number) => {
    this.setState({
      amount: value
    })
  }

  handleOnOk = (addProduct: MutationFn<AddProductToBookingMutation, AddProductToBookingMutationVariables>) => () => {
    const { idProduct, idBooking } = this.props
    const { amount } = this.state

    addProduct({
      variables: {
        amount,
        idBooking,
        idProduct,
      }
    })
  }

  render() {
    const { min, max, defaultValue } = this.props
    return (
      <div>
        <InputNumber
          min={min}
          max={max}
          defaultValue={defaultValue}
          onChange={this.handleChange}
        />
        <Divider type="vertical" />
        <AddProductToBooking
          mutation={ADD_PRODUCT_TO_BOOKING}
        >
          {( addProduct ) => (
            <Button
              type="default"
              onClick={this.handleOnOk(addProduct)}
            >
              Add to chart
            </Button>
          )}
        </AddProductToBooking>
      </div>
    )
  }
}

export default ActionCard