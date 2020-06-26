import { Component, createContext } from 'react'
import { Query } from 'react-apollo'
import { LindaSalonIconWhite } from 'components/icons/linda-salon-icon'
import { MeQuery, DataUserForProductFragment } from 'types/schema-types'
import ME_QUERY3 from 'queries/user/meQ.graphql'
import dataUserForProductFragment from 'queries/fragment/dataUserForProductFragment.graphql'
import { Layout, Row } from 'antd'
import { filter } from 'graphql-anywhere'
import MenuBarAdmin from 'components/menuBarAdmin'

const { Header, Content, Sider } = Layout;

type Props = {
  idUser: string | undefined 
  nameHeader: string
}

type ContextAdminLayoutType = {
  dataUserForProductFilter: DataUserForProductFragment | undefined
  idUser: string | undefined
}

const ctxt = createContext<ContextAdminLayoutType | null>(null)

const AdminLayoutProvider = ctxt.Provider
  
export const AdminLayoutConsumer = ctxt.Consumer

class MeQComponent extends Query<MeQuery, {}> {}

type State = typeof initialState

const initialState = {
  collapsed: false,
}

export class AdminLayoutWithProvider extends Component <Props, State> {
  readonly state: State = initialState

  private onCollapse = (collapsed) => {
    this.setState({ collapsed })
  }

  render() {
    const { children, idUser, nameHeader } = this.props
    const { collapsed } = this.state
    return (
      <MeQComponent
        query={ME_QUERY3}
        fetchPolicy="cache-only"
      >
        {({ data }) => {
          const result = data && data.me ? { me: data.me } : {}
          const hasMeKey = result.hasOwnProperty('me')
          const dataUserForProductFilter: DataUserForProductFragment | undefined = hasMeKey ? filter(dataUserForProductFragment, result.me) : undefined
          return (
            <AdminLayoutProvider
              value={{
                idUser,
                dataUserForProductFilter 
              }}
            >
              <Layout style={{ minHeight: '100vh' }}>
                <Sider
                  collapsible
                  collapsed={this.state.collapsed}
                  onCollapse={this.onCollapse}
                  width={240}
                >
                  { collapsed
                    ? null
                    : (
                        <div style={{ width: "100%", textAlign: "center", margin: "18px 0"}}>
                          <LindaSalonIconWhite />
                        </div>
                    )
                  }
                  <MenuBarAdmin />
                </Sider>
              <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                  <Row type="flex" justify="center" align="middle">
                    <h2>{nameHeader}</h2>
                  </Row>
                </Header>
                <Content style={{ margin: '56px 16px' }}>
                  {children}
                </Content>
              </Layout>
            </Layout>
            </AdminLayoutProvider>
          )
        }}
      </MeQComponent>
    )
  }
}