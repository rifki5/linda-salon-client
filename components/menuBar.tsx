import { SFC } from 'react'
import { Menu } from 'antd'
import { withRouter, SingletonRouter } from 'next/router'
import Link from 'next/link'

type Props = {
  router?: SingletonRouter
}

const MenuBar: SFC<Props> = ({ router }) => (
  <Menu
    selectedKeys={ router ? [router.pathname] : undefined}
    mode="horizontal"
    className="menu-top-navigation"
  >
    <Menu.Item key="/">
      <Link href="/" prefetch>
        <a>Home</a>
      </Link>
    </Menu.Item>
    <Menu.Item key="/produk">
      <Link href="/produk" prefetch>
        <a>Produk</a>
      </Link>
    </Menu.Item>
    <Menu.Item key="/paket-nikah">
      <Link href="/paket-nikah" prefetch>
        <a>Paket Nikah</a>
      </Link>
    </Menu.Item>
  </Menu>
)

export default withRouter(MenuBar)