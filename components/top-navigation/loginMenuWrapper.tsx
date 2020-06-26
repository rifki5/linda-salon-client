import { SFC } from 'react'
import { Dropdown } from 'antd'
import loginMenuOverlay from './loginMenuOverlay'
import { ApolloConsumer } from 'react-apollo'

const LoginMenuWrapper: SFC<{}> = ({ children }) => (
  <ApolloConsumer>
    {( client ) => (
      <Dropdown overlay={loginMenuOverlay(client)()} placement="bottomLeft">
        {children}
      </Dropdown>
    )}
  </ApolloConsumer>
)

export default LoginMenuWrapper