import { Component } from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import { Modal, DatePicker, Row, message } from 'antd'
import { RangePickerValue } from 'antd/lib/date-picker/interface'
import { CreateBookingMutation, CreateBookingMutationVariables, MeQuery }  from 'types/schema-types'
import CREATE_BOOKING from 'queries/booking/createBookingM.graphql'
import ME_QUERY3 from 'queries/user/meQ.graphql'

type State = typeof initialState

class CreateBooking extends Mutation<CreateBookingMutation, CreateBookingMutationVariables> {}

const initialState = {
  isModalVisible: false,
  okButtonDisable: true,
  startDate: '',
  endDate: ''
}

type Props = {
  controlModal: (visible: boolean) => void
  isVisible: boolean
  onCancel: () => void
}

// createBookingM: MutationFunc<createBookingM, createBookingMVariables> | undefined

class ModalCreateBooking extends Component<Props, State> {

  readonly state: State = initialState

  private handleChange = (dates: RangePickerValue) => {
    this.setState({
      startDate: dates[0] ? dates[0]!.format('YYYY-MM-DD') : '',
      endDate: dates[1] ? dates[1]!.format('YYYY-MM-DD') : '',
    }, () => {
      const { startDate, endDate } = this.state
      if (startDate !== '' && endDate !== '') this.setState({ okButtonDisable: false })
    })
  }

  private handleOk = (createBookingM: MutationFn<CreateBookingMutation, CreateBookingMutationVariables>) => () => {
    const { endDate, startDate } = this.state

    if ( endDate !== '' && startDate !== '' && createBookingM) {
      createBookingM({
        variables: {
          startDate,
          endDate
        },
        update: (client, result) => {
          const readQuery = client.readQuery<MeQuery>({ query: ME_QUERY3 })
          const { data } = result
          const createBookingResult = data && data.createBooking ? data.createBooking : undefined
          if (readQuery && createBookingResult ) {
            const bookings = [ ...readQuery.me.bookings, createBookingResult]
            client.writeQuery<MeQuery>({
              query: ME_QUERY3,
              data: {
                me: { ...readQuery.me, bookings } as any
              }
            })
          }
        }
      }).then(result => {
        if (result) {
          message.success('Berhasil membuat booking')
          this.props.controlModal(false)
        }
      }).catch(error => {
        message.error(error.message)
      })
    } else {
      message.error('masukkan tanggal!')
    }
  }

  render() {
    const { isVisible, onCancel } = this.props
    const { okButtonDisable } = this.state
    return (
      <CreateBooking
        mutation={CREATE_BOOKING}
      >
        {(createBooking) => (
          <Modal
            title="Masukkan tanggal Mulai dan Akhir Pesanan"
            centered
            cancelText="Batal"
            okText="Buat"
            onOk={() => this.handleOk(createBooking)()}
            visible={isVisible}
            onCancel={onCancel}
            okButtonProps={{ disabled: okButtonDisable }}
          >
            <Row
              type="flex"
              justify="center"
            >
              <DatePicker.RangePicker 
                placeholder={["Tanggal mulai", "Tanggal selesai"]}
                format="DD-MM-YYYY" 
                onChange={this.handleChange}
              />
            </Row>
          </Modal>
        )}
     </CreateBooking>
    )
  }
}

export default ModalCreateBooking