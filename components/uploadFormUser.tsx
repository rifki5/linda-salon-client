import { Component } from 'react'
import { Upload, message, Icon, Card, Modal } from 'antd'
import beforeUpload from 'utilities/beforeUploadFn'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { MutationFn } from 'react-apollo'
import { PureQueryOptions } from 'apollo-client'

type State = typeof initialState

type Props = {
  defaultPhoto: any | null
  requestUpload: MutationFn
  requesRemove: MutationFn
  refetchQueries?: Array<string | PureQueryOptions>
  callback?: (data: Object) => void
}

const initialState = {
  previewImage: '',
  previewVisible: false,
  fileList: [] as Array<any>
}

class UploadPhotoUser extends Component<Props, State> {

  readonly state: State = initialState

  private handleCancel = () => this.setState({ previewVisible: false })

  private handlePreview = (photoUrl: string) => {
    this.setState({
      previewImage: photoUrl,
      previewVisible: true,
    });
  }

  private handleRequest = (data: UploadChangeParam) => {
    const { requestUpload, refetchQueries, callback } = this.props
    requestUpload({
      variables: {
        file: data.file
      },
      refetchQueries
    }).then((result: any) => {
      this.setState({
        fileList: [{...result.data.uploadUserPhoto}]
      }, callback ? () => callback(result.data) : undefined)
      message.success('berhasil upload photo')
    }).catch(() => {
      message.error('error upload photo')  
    })
  }

  private handleDelete = ( idPhoto: string, key: string ) => {
    const { requesRemove, refetchQueries, callback } = this.props
    requesRemove({
      variables: {
        idPhoto,
        key,
      },
      refetchQueries
    }).then(() => {
      this.setState({
        fileList: []
      }, callback ? () => callback({}) : undefined)
      message.success('berhasil delete photo')
    }).catch(() => message.error('gagal delete photo'))
  }

  render() {
    const { defaultPhoto } = this.props
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          name="upload"
          listType="picture-card"
          showUploadList={false}
          customRequest={(data: UploadChangeParam) => this.handleRequest(data)}
          beforeUpload={beforeUpload}
        >
          {defaultPhoto && defaultPhoto.id || fileList.length === 1 ? null : uploadButton}
        </Upload>
        {
          defaultPhoto && defaultPhoto.id
            ? (
                <Card
                  key={defaultPhoto.id}
                  hoverable
                  bodyStyle={{ padding: 0 }}
                  style={{ width: 240 }}
                  cover={<img alt="example" src={defaultPhoto.url} />}
                  actions={[
                    <Icon type="eye" onClick={() =>this.handlePreview(defaultPhoto.url)}/>,
                    <Icon type="delete" onClick={() => this.handleDelete(defaultPhoto.id, defaultPhoto.key)}/>
                  ]}
                />
              )
            : fileList.length && fileList[0]
            ? (
                <Card
                  key={fileList[0].id}
                  hoverable
                  bodyStyle={{ padding: 0 }}
                  style={{ width: 240 }}
                  cover={<img alt="example" src={fileList[0].url} />}
                  actions={[
                    <Icon type="eye" onClick={() =>this.handlePreview(fileList[0].url)}/>,
                    <Icon type="delete" onClick={() => this.handleDelete(fileList[0].id, fileList[0].key)}/>
                  ]}
                />
              )
            : null
        }
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    )
  }
}

export default UploadPhotoUser