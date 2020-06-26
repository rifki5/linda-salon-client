import React, { Component } from 'react'
import { message, Form, Input, Button, Layout } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { graphql, compose, MutationFunc, DataValue } from 'react-apollo'
import { singUpMutation, singUpMutationVariables, MeQuery } from 'types/schema-types'
import SINGUP_QUERY from 'queries/user/signUpM.graphql'
import ME_QUERY from 'queries/user/meQ.graphql'
import Router from 'next/router'
import { LindaSalonIcon } from 'components/icons/linda-salon-icon'

const FormItem = Form.Item;
const { Content } = Layout

type PropSignUp = {
  meQ: DataValue<MeQuery>,
  singUpMutation: MutationFunc<singUpMutation, singUpMutationVariables> | undefined
} & FormComponentProps

const hasErrors = fieldsError => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignUpUser extends Component<PropSignUp,{}> {

  state = {
    confirmDirty: false
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const { form, singUpMutation } = this.props
    event.preventDefault()
    form.validateFields((err, values) => {
      if (!err && singUpMutation) {
        singUpMutation({
          variables: {
            name: values.name,
            email: values.email,
            password: values.password
          }
        }).then(result => {
          if (result) {
            localStorage.setItem('token', result.data.signup.token)
            Router.push('/')
          }
        }).catch(error => message.error(error.message))
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    console.log(rule)
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    console.log(rule)
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true } as any);
    }
    callback();
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const nameError = isFieldTouched('name') && getFieldError('name')
    const emailError = isFieldTouched('email') && getFieldError('email')
    const passwordError = isFieldTouched('password') && getFieldError('password')
    const confirmPasswordError = isFieldTouched('confirmPassword') && getFieldError('confirmPassword')

    return (
      <Layout className="login-cover">
        <Content className="content-login">
          <Layout className="login-wrapper">
            <LindaSalonIcon />
          </Layout>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={nameError ? 'error' : 'success'}
              help={nameError || ''}
            >
              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: 'Please input your name!'}
                  ]
                })(
                  <Input type="text" placeholder="Name" />
                )
              }
            </FormItem>
            <FormItem
              validateStatus={emailError ? 'error' : 'success'}
              help={emailError || ''}
            >
              {
                getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'Please input your email!'}
                  ]
                })(
                  <Input type="text" placeholder="Email" />
                )
              }
              
            </FormItem>
            <FormItem
              validateStatus={passwordError ? 'error' : 'success'}
              help={passwordError || ''}
            >
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please input your password!' },
                    { validator: this.validateToNextPassword }
                  ]
                })(
                  <Input type="password" placeholder="Password" />
                )
              }
            </FormItem>
            <FormItem
              validateStatus={confirmPasswordError ? 'error' : 'success'}
              help={confirmPasswordError || ''}
            >
              {
                getFieldDecorator('confirmPassword', {
                  rules: [
                    { required: true, message: 'Please confirm your password!' },
                    { validator: this.compareToFirstPassword }
                  ]
                })(
                  <Input type="password" placeholder="Confirm Password" />
                )
              }
            </FormItem>
            <FormItem>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} className="button-submit-login">
              Sign up
            </Button>
          </FormItem>
          </Form>
        </Content>
      </Layout>
    )
  }
}

const SignUpUserUpWrapper = Form.create({})(SignUpUser)

const WithSingUpMutation = compose(
  graphql<{}, MeQuery, {}, {}>(ME_QUERY, {
    name: 'meQ',
    options: {
      fetchPolicy: "network-only"
    },
  }),
  graphql<{}, singUpMutation, singUpMutationVariables, {}>(SINGUP_QUERY, {
    name: 'singUpMutation'
  })
)(SignUpUserUpWrapper)

export default WithSingUpMutation