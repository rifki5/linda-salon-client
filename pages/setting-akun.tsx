import React from 'react' 
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery } from 'types/schema-types'
import { UserLayoutWithProvider, UserLayoutConsumer } from 'layout/layoutUser'
import FormSettingAccount from 'components/formSettingAccount'
import redirect from 'lib/redirect'
import { Row, Layout } from 'antd'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery,
}

class SettingAkun extends React.Component<Props> {
  static async getInitialProps (context: NextContextNewContext) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    if (loggedInUser && loggedInUser.me) {
      return {
        loggedInUser,
      }
    } else {
      redirect(context, '/user-login')
    }
  }

  render() {
    const { loggedInUser } = this.props 
    return (
      <>
      <UserLayoutWithProvider
        idUser={loggedInUser && loggedInUser.me ? loggedInUser.me.id : undefined}
      >
        <UserLayoutConsumer>
          {( appProvider ) => {
            if ( appProvider && appProvider.idUser ) {
              return (
                <Layout.Content style={{ marginTop: 110, padding: "50px 50px", background: "#FFF"}}>
                  <Row type="flex" justify="center">
                    <FormSettingAccount idUser={loggedInUser.me.id} />
                  </Row>
                </Layout.Content>
              )
            }
          }}
          
        </UserLayoutConsumer>
      </UserLayoutWithProvider>
      </>
    )
  }
}

export default SettingAkun

 