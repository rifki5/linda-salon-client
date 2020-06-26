import { Component } from 'react'
import { Layout, Row } from 'antd'
import Logo from 'components/logo'
import LoginMenu from 'components/top-navigation/loginMenu'
import BookingMenu from 'components/top-navigation/bookingMenu'
import DrawerBooking from 'components/top-navigation/drawerBooking'
import ModalCreateBooking from 'components/top-navigation/modalCreateBooking'
import { LoginMenuFragment, BookingMenuFragment } from 'types/schema-types'

type State = typeof initialState
type Props = {
  loginMenuData: LoginMenuFragment | undefined
  bookingMenuData: BookingMenuFragment | undefined
}

const { Header } = Layout

const initialState = {
  showDrawer: false,
  showModal: false
}

class TopNavigation extends Component<Props, State> {
  readonly state: State = initialState

  private controlDrawer = (visible: boolean) => {
    this.setState({
      showDrawer: visible
    })
  }

  private controlModal = (visible: boolean) => {
    this.setState({
      showModal: visible
    })
  }

  render() {
    const { loginMenuData, bookingMenuData } = this.props
    return (
      <Layout>
        <Header className="top-navigation">
          <Logo />
          <Row type="flex" justify="center" align="middle">
            <BookingMenu 
              controlDrawer={(visible => this.controlDrawer(visible))}
              controlModal={(visible => this.controlModal(visible))}
              data={bookingMenuData}
            />
            <LoginMenu
              data={loginMenuData}
            />
          </Row>
        </Header>
        {
          bookingMenuData && bookingMenuData.bookings.length !== 0 
            ? (
                <DrawerBooking 
                  isVisible={this.state.showDrawer}
                  controlDrawer={(visible) => this.controlDrawer(visible)}
                  data={bookingMenuData}
                />
              )
            : (
                <ModalCreateBooking 
                  controlModal={(visible) => this.controlModal(visible)}
                  isVisible={this.state.showModal}
                  onCancel={() => this.controlModal(false)}
                />
              )
        }
      </Layout>   
    )
  }
}

export default TopNavigation