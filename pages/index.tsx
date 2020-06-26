import React from 'react' 
import checkLoggedIn from 'lib/checkLoggedIn'
import { NextContextNewContext } from 'lib/withApollo'
import { MeQuery } from 'types/schema-types'
import { LindaSalonIconWhiteLarge } from 'components/icons/linda-salon-icon'
import { UserLayoutWithProvider, UserLayoutConsumer } from 'layout/layoutUser'
import { Layout, Row, Col, Icon, Carousel } from 'antd'
import WhatsApp from 'components/icons/whatsapp'
import Bbm from 'components/icons/bbm'
import '../styles/index.less'

type Props = {
  loggedInUser: MeQuery,
}

class Index extends React.Component<Props> {
  static async getInitialProps (context: NextContextNewContext) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    return {
      loggedInUser
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
            if ( appProvider ) {
              return (
                <>
                  <Layout.Content style={{ marginTop: 110 }}>
                     <Carousel autoplay>
                      <div className="img-cover img-1" />
                      <div className="img-cover img-2" />
                      <div className="img-cover img-3" />
                      <div className="img-cover img-4" />
                    </Carousel>
                    <Row 
                      type="flex"
                      justify="center"
                      align="middle"
                      className="slide-1"
                      style={{
                        marginBottom: 12
                      }}
                    >
                      <h2 className="head-1">Selamat Datang di</h2>
                      <LindaSalonIconWhiteLarge />
                    </Row>
                    
                    <Row 
                      type="flex"
                      gutter={24}
                      justify="center"
                      style={{
                        padding: "64px 50px"
                      }}
                    >
                      <Col
                        span={12}
                      >
                        <h1 className="heading-admin">Tentang Kami</h1>
                        <p>Linda Salon menyediakan layanan pernikahan seperti Paket Pernikahan, Rias Pengantin, Busana Pengantin, Dekorasi Pernikahan, Foto Pengantin, Video Shooting, Pager Ayu / Bagus, Upacara Adat / Kesenian </p>
                      </Col>
                      <Col
                        span={12}
                      >
                        <h1 className="heading-admin">Kontak</h1>
                        <p>Dengan senang hati kami akan membantu anda dalam mengemas pernikahan anda. Silahkan kontak Linda Salon untuk informasi lebih lanjut, informasi kontak kami :</p>
                        <div className="kontak-wrapper">
                          <span className="kontak-icon">
                            <Icon className="icon" type="home" style={{ fontSize: 24 }}/>
                            Jl. Rancajigang RT.01 / RW.15 Ds. Padamulya Kec. Majalaya Kab. Bandung 40382
                          </span>
                        </div>
                        <div className="kontak-wrapper">
                          <span className="kontak-icon">
                            <Icon className="icon" type="instagram" style={{ fontSize: 24 }}/>
                            Winda_Linda_Salon / #Lindasalon 
                          </span>
                        </div>
                        <div className="kontak-wrapper">
                          <span className="kontak-icon">
                            <Icon className="icon" type="facebook" style={{ fontSize: 24 }}/>
                            Winda Hidayanti / Linda Salon 
                          </span>
                        </div>
                        <div className="kontak-wrapper">
                          <span className="kontak-icon">
                            <WhatsApp />
                            <p style={{ margin: "0 0 0 8px" }}>08386464700 / 083822251836 / 085722357503</p>
                          </span>
                        </div>
                        <div className="kontak-wrapper">
                          <span className="kontak-icon">
                            <Bbm />
                            <p style={{ margin: "0 0 0 8px" }}>5C6FE740 / 52BE3196</p>
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </Layout.Content>
                </>
              )
            }
          }}
        </UserLayoutConsumer>
      </UserLayoutWithProvider>
      </>
    )
  }
}

export default Index

 