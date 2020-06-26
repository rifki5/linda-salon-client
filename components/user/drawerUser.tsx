import React, { Component } from 'react'
import { Drawer } from 'antd'

type DrawerUserProps = {
  onClose: () => void,
  visible: boolean
}

const DefaultState = {
  onClose: true,
  visible: false
}

type State = {

} & typeof DefaultState

class DrawerUser extends Component<DrawerUserProps, State> {
  static state: State = DefaultState

  render() {
    const { onClose, visible } = this.props
    return (
      <Drawer
        title="User Setting"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <p>menumenu</p>
      </Drawer>
    )
  }
}

export default DrawerUser