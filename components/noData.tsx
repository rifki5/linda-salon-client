import { Col } from "antd"

const NoData = () => (
    <Col span={24} style={{ 
      minHeight: '434px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>No Data</h1>
    </Col>
)

export default NoData