import { SFC, createContext } from 'react'
import { Query } from 'react-apollo'
import { MeQuery, LoginMenuFragment, BookingMenuFragment, DataUserForProductFragment } from 'types/schema-types'
import ME_QUERY3 from 'queries/user/meQ.graphql'
import loginMenuFragment3 from 'queries/fragment/loginMenuFragment.graphql'
import bookingMenuFragment from 'queries/fragment/bookingMenuFragment.graphql'
import dataUserForProductFragment from 'queries/fragment/dataUserForProductFragment.graphql'
import { Layout } from 'antd'
import { filter } from 'graphql-anywhere'
import TopNavigation from 'components/top-navigation'
import MenuBar from 'components/menuBar'

type Props = {
  idUser: string | undefined 
}

type ContextUserLayoutType = {
  dataUserForProductFilter: DataUserForProductFragment | undefined
  idUser: string | undefined
}

const ctxt = createContext<ContextUserLayoutType | null>(null)

const UserLayoutProvider = ctxt.Provider
  
export const UserLayoutConsumer = ctxt.Consumer

class MeQComponent extends Query<MeQuery> {}

export const UserLayoutWithProvider: SFC<Props> = ({ idUser, children }) => (
  <MeQComponent
    query={ME_QUERY3}
    fetchPolicy="cache-only"
  >
    {({ data }) => {
      const result = data && data.me ? { me: data.me } : {}
      const hasMeKey = result.hasOwnProperty('me')
      const loginMenuDataFilter: LoginMenuFragment | undefined = hasMeKey ? filter(loginMenuFragment3, result.me) : undefined
      const bookingMenuDataFilter: BookingMenuFragment | undefined = hasMeKey ? filter(bookingMenuFragment, result.me) : undefined
      const dataUserForProductFilter: DataUserForProductFragment | undefined = hasMeKey ? filter(dataUserForProductFragment, result.me) : undefined
      return (
        <UserLayoutProvider
          value={{
            idUser,
            dataUserForProductFilter 
          }}
        >
          <Layout style={{ background: "#FFF" }}>
            <div style={{
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              zIndex: 99
            }}>
              <TopNavigation
                loginMenuData={loginMenuDataFilter}
                bookingMenuData={bookingMenuDataFilter}
              />
              <MenuBar />
            </div>
            {children}
            <Layout.Footer style={{ textAlign: "center" }}><p style={{ margin: 0 }}>made with ❤️ by linda Salon</p></Layout.Footer>
          </Layout>
        </UserLayoutProvider>
      )
    }}
  </MeQComponent>
)