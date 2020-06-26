import { Modal } from 'antd'
import logoutFunc from 'utilities/logoutFunc'
import { ApolloClient } from 'apollo-boost'

const modalConfirm = (client: ApolloClient<any>) => {
  const confirm = Modal.confirm
  confirm({
    title:"Yakin ingin logout ?",
    onOk: () => logoutFunc(client),
    okText: "Yes",
    cancelText: "No",
    centered: true
  })
}

export default modalConfirm