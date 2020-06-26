import { Component } from 'react'
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery, UserQuery, UserQueryVariables } from 'types/schema-types'
import { Row } from 'antd'
import USER_QUERY from 'queries/user/user.graphql'
import FormEditUser from 'components/formEditUser'
import { AdminLayoutWithProvider, AdminLayoutConsumer } from 'layout/layoutAdmin'
import { Query } from 'react-apollo'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery
  queryId: string
}

class QueryUser extends Query<UserQuery, UserQueryVariables> {}

class FormEditUserQ extends Component<Props> {
  static async getInitialProps (context: NextContextNewContext) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    const queryId = context.query.id
    if (loggedInUser && loggedInUser.me && loggedInUser.me.role !== "ADMIN") {

    }

    return {
      loggedInUser,
      queryId: queryId
    }
  }

  render() {
    const { loggedInUser, queryId } = this.props
    return (
      <AdminLayoutWithProvider
        idUser={loggedInUser && loggedInUser.me ? loggedInUser.me.id : undefined}
        nameHeader="Edit / Lihat User"
      >
        <AdminLayoutConsumer>
          {( appProvider ) => {
            if (appProvider) {
              return (
                <Row
                  type="flex"
                  justify="center"
                  align="middle"
                >
                  <QueryUser
                    query={USER_QUERY}
                    variables={{
                      id: queryId
                    }}
                  >
                    {({ data, error }) => {
                      if (!error && data && data.user) {
                        return (
                          <FormEditUser 
                            data={data.user}
                          />
                        )
                      } else {
                        return null
                      }
                    }}
                  </QueryUser>
                </Row>
              )
            }
          }}
        </AdminLayoutConsumer>
      </AdminLayoutWithProvider>
    )
  }
}

export default FormEditUserQ