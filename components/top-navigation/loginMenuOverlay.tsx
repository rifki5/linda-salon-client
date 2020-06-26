import { Menu } from 'antd'
import Link from 'next/link'
import { ApolloClient } from 'apollo-boost'
import modalConfirm from './modalConfirm'

const LoginMenuOverlay = (client: ApolloClient<any>) => () => (
  <Menu>
    <Menu.Item>
      <Link replace href="/user-booking">
        <a>List booking</a>
      </Link>
    </Menu.Item>
    <Menu.Item>
      <Link prefetch href="/setting-akun">
        <a>Setting akun</a>
      </Link>
    </Menu.Item>
    <Menu.Item>
      <a onClick={() => modalConfirm(client)}>Logout</a>
    </Menu.Item>
  </Menu>
)

export default LoginMenuOverlay