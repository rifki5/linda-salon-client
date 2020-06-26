import React, { Component } from 'react'
import { message, Layout, Form, Icon, Input, Button } from 'antd'
import { graphql, compose, MutationFunc, DataValue } from 'react-apollo'
import { LindaSalonIcon } from 'components/icons/linda-salon-icon'
import { FormComponentProps } from 'antd/lib/form'
import { LoginMutation, LoginMutationVariables, MeQuery } from 'types/schema-types'
import ME from 'queries/user/meQ.graphql'
import LOGIN from 'queries/user/loginM.graphql'
import cookie from 'cookie'
import Router from 'next/router'
import '../styles/index.less'

const { Content } = Layout
const FormItem = Form.Item

type PropLogin = {
  meQ: DataValue<MeQuery>,
  loginMutation: MutationFunc<LoginMutation, LoginMutationVariables> | undefined
} & FormComponentProps

const hasErrors = fieldsError => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserLogin extends Component<PropLogin, {}>{
  
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  
  private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { form, loginMutation } = this.props
    event.preventDefault();
    form.validateFields((err, values) => {
      if (!err && loginMutation) {
        loginMutation({
          variables: {
            email: values.email,
            password: values.password
          }
        }).then(result => {
          if (result) {
            document.cookie = cookie.serialize('token', result.data.login.token, {
              maxAge: 30 * 24 * 60 * 60 // 30 days
            })
            localStorage.setItem('token', result.data.login.token)
            if (result.data.login.user.role === 'ADMIN') {
              Router.push('/home-admin')
            } else {
              Router.push('/')
            }
          }
        }).catch(error => message.error(error.message))
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

    const userNameError = isFieldTouched('email') && getFieldError('email')
    const passwordError = isFieldTouched('password') && getFieldError('password')
    
    return (
      <Layout className="login-cover">
        
        <Content className="content-login">
        <Layout className="login-wrapper">
          <LindaSalonIcon />
        </Layout>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <FormItem
            validateStatus={userNameError ? 'error' : 'success'}
            help={userNameError || ''}
          >
            
            {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
          </FormItem>
          <FormItem
            validateStatus={passwordError ? 'error' : 'success'}
            help={passwordError || ''}
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} className="button-submit-login">
              Log in
            </Button>
            <div className="register-wrapper">
              Or <a onClick={() => Router.push('/signup-user')} >Daftar sekarang!</a>
            </div>
          </FormItem>
        </Form>
        </Content>
      </Layout>
    )
  }
}

const WithLoginMutation = compose(
  graphql<{}, LoginMutation, LoginMutationVariables, {}>(LOGIN, {
    name: 'loginMutation',
  }),
  graphql<{}, MeQuery, {}, {}>(ME, {
    name: 'meQ',
    options: {
      fetchPolicy: "network-only"
    }
  }),
  Form.create({})
)(UserLogin)

export default WithLoginMutation