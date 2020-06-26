import { SFC } from 'react'
import { Menu, Icon } from 'antd'
import { SingletonRouter, withRouter } from 'next/router'
import modalConfirm from 'components/top-navigation/modalConfirm'
import { ApolloConsumer } from 'react-apollo'
import Router from 'next/router'

type Props = {
  router?: SingletonRouter
}

const MenuBarAdmin: SFC<Props> = ({ router }) => (
  <ApolloConsumer>
    {( client ) => (
      <Menu 
      theme="dark"
      selectedKeys={ router ? [router.pathname] : undefined}
      mode="inline"
      >
        <Menu.SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="user" />
              <span>Menu Admin</span>
            </span>}
        >
          <Menu.Item 
            key="/setting-akun"
            onClick={() => Router.push('/form-setting-admin')}
          >
            Setting akun
          </Menu.Item>
          <Menu.Item
            onClick={() => modalConfirm(client)}
          >
            Logout
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item 
          key="/data-user" 
          onClick={() => Router.push({ pathname: "/data-user" })}
        >
          <Icon type="inbox" />
          <span>Data User</span>
        </Menu.Item>
        <Menu.Item 
          key="/data-produk" 
          onClick={() => Router.push({ pathname: "/data-produk" })}
        >
          <Icon type="inbox" />
          <span>Data Produk</span>
        </Menu.Item>
        <Menu.Item 
          key="/data-paket-wedding"
          onClick={() => Router.push({ pathname: "/data-paket-wedding" })}
        >
          <Icon type="inbox" />
          <span>Data Paket Nikah</span>
        </Menu.Item>
        <Menu.Item 
          key="/data-booking"
          onClick={() => Router.push({ pathname: "/data-booking" })}
        >
          <Icon type="inbox" />
          <span>Data Booking</span>
        </Menu.Item>
      </Menu>
    )}
  </ApolloConsumer>
)

export default withRouter(MenuBarAdmin)