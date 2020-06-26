import { Component } from 'react'
import { Form, Input, Row, message, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { graphql, compose, MutationFunc, withApollo } from 'react-apollo'
import { UploadUserPhotoMutation, UploadUserPhotoMutationVariables, DeleteUserPhotoMutationVariables, DeleteUserPhotoMutation, MeQuery, UpdateUserMutation, UpdateUserMutationVariables } from 'types/schema-types'
import UPLOAD_USER_PHOTO from 'queries/user/uploadUserPhoto.graphql'
import DELETE_USER_PHOTO from 'queries/user/deleteUserPhoto.graphql'
import UPDATE_USER2 from 'queries/user/updateUser.graphql'
import ME_QUERY from 'queries/user/meQ.graphql'
import { ApolloClient } from 'apollo-boost'
import UploadFormUser from 'components/uploadFormUser'
import hasErrors from 'utilities/hasError'

type FuncMutation = {
  uploadPhotoMutation: MutationFunc<UploadUserPhotoMutation, UploadUserPhotoMutationVariables>,
  deletePhotoMutation: MutationFunc<DeleteUserPhotoMutation, DeleteUserPhotoMutationVariables>,
  updateUser: MutationFunc<UpdateUserMutation, UpdateUserMutationVariables>,
  client: ApolloClient<any>
}

type Props = {
  idUser: string
} 
  & FormComponentProps
  & FuncMutation


const FormItem = Form.Item

class FormSettingAccount extends Component<Props, {}> {

  componentDidMount() {
    const { form, client } = this.props 
    const dataMe = client.readQuery({ query: ME_QUERY }) as MeQuery
    form.setFieldsValue({
      name: dataMe.me.name,
      email: dataMe.me.email
    })
  }

  private handleSubmit = (e) => {
    e.preventDefault()
    const { updateUser, form, idUser } = this.props
    form.validateFields((err, fieldsValue) => {
      if (!err && updateUser) {
        updateUser({
          variables: {
            email: fieldsValue['email'],
            name: fieldsValue['name'],
            password: fieldsValue['password'],
            whereId: idUser
          }
        }).then(() => 
          message.success('Berhasil update')
        ).catch(() => 
          message.error('error update')
        )
      }
    })
  }
  
  render() {
    const { client } = this.props
    const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form
    const { me } = client.readQuery({ query: ME_QUERY }) as MeQuery

    const nameError = isFieldTouched('name') && getFieldError('name')
    const emailError = isFieldTouched('email') && getFieldError('email')

    return (
      <Form
        layout="vertical"
        style={{ width: 480 }}
        onSubmit={this.handleSubmit}
      >
        <Row type="flex" justify="center">
          <div>
           <UploadFormUser 
              requesRemove={this.props.deletePhotoMutation}
              requestUpload={this.props.uploadPhotoMutation}
              defaultPhoto={me.photo}
              refetchQueries={[{
                query: ME_QUERY
              }]}
           />
          </div>
        </Row>
        <FormItem 
          label="Nama"
          validateStatus={nameError ? 'error' : 'success'}
          help={nameError || ''}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'tolong masukkan nama!' }],
          })(
            <Input type="text"/>
          )}
        </FormItem>
        <FormItem 
          label="email"
          validateStatus={emailError ? 'error' : 'success'}
          help={emailError || ''}
        >
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'tolong masukkan email!' }],
          })(
            <Input type="text" />
          )}
        </FormItem>
        <FormItem 
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{ required: false, message: 'tolong masukkan password!' }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} className="button-submit-login">
            Update
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WithCompose = compose(
  graphql<{}, UploadUserPhotoMutation, UploadUserPhotoMutationVariables, {}>(UPLOAD_USER_PHOTO, {
    name: 'uploadPhotoMutation'
  }),
  graphql<{}, DeleteUserPhotoMutation, DeleteUserPhotoMutationVariables, {}>(DELETE_USER_PHOTO, {
    name: 'deletePhotoMutation'
  }),
  graphql<{}, UpdateUserMutation, UpdateUserMutationVariables, {}>(UPDATE_USER2,{
    name: 'updateUser'
  }),
  Form.create({}),
  withApollo,
)(FormSettingAccount)

export default WithCompose