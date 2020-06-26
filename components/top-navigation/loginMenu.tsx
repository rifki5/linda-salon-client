import { SFC } from 'react'
import LoginMenuWrapper from './loginMenuWrapper'
import { Avatar, Button, Row } from 'antd'
import Link from 'next/link'
import { LoginMenuFragment } from 'types/schema-types'

type Props = {
  data: LoginMenuFragment | undefined
}
const LoginMenu: SFC<Props> = ({ data }) => (
  <span>
    { data && data.id
      ? (
          <LoginMenuWrapper>
            { data.photo
              ? (
                  <Row type="flex" justify="center" align="middle">
                    <Avatar src={data.photo.url} />
                    <p style={{ margin: "0 0 0 8px", color:"#FFF" }}>{data.name}</p>
                  </Row>
                )
              : <Avatar icon="user" />
            }
          </LoginMenuWrapper>
        )
      : (
          <Link href="/user-login" prefetch>
            <Button type="primary">
              Login
            </Button>
          </Link>
        )
    }
  </span>
)

export default LoginMenu