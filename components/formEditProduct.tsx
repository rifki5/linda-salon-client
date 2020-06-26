import { Component } from 'react'
import { Form, Input, Row, message, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { graphql, compose, MutationFunc } from 'react-apollo'
import { UploadProductPhotoMutation, UploadProductPhotoMutationVariables, DeleteProductPhotoMutation, DeleteProductPhotoMutationVariables, UpdateProductMutation, UpdateProductMutationVariables, ProductQuery } from 'types/schema-types'
import UPLOAD_PRODUCT_PHOTO from 'queries/product/uploadProductPhotoM.graphql'
import DELETE_PRODUCT_PHOTO from 'queries/product/deleteProductPhoto.graphql'
import UPDATE_PRODUCT from 'queries/product/updateProduct.graphql'
import PRODUCT_QUERY from 'queries/product/product.graphql'
import UploadFormUser from 'components/uploadFormUser'
import hasErrors from 'utilities/hasError'
import Router from 'next/router'
const ReactQuill = typeof document !== 'undefined' && require('react-quill').default

type FuncMutation = {
  uploadPhotoMutation: MutationFunc<UploadProductPhotoMutation, UploadProductPhotoMutationVariables>,
  deletePhotoMutation: MutationFunc<DeleteProductPhotoMutation, DeleteProductPhotoMutationVariables>,
  updateProduct: MutationFunc<UpdateProductMutation, UpdateProductMutationVariables>,
}

type Props = {
  data: ProductQuery['product']
} & FormComponentProps & FuncMutation

const FormItem = Form.Item

type State = typeof initialState

const initialState = {
  filelist: {} as ProductQuery['product']['photo'],
  description: ''
}

class FormEditProduct extends Component<Props, State> {
  readonly state: State = initialState

  componentDidMount() {
    const { form, data } = this.props 
    // To disabled submit button at the beginning.
    form.validateFields()
    if (data.description) {
      this.setState({
        description: data.description
      })
    }
    form.setFieldsValue({
      name: data.name,
      price: data.price,
      stock: data.stock,
      description: data.description,
    })
  }

  private handleSubmit = (e) => {
    e.preventDefault()
    const { updateProduct, form, data } = this.props

    const { filelist, description } = this.state
    form.validateFields((err, fieldsValue) => {
      if (!err && description !== '') {
        updateProduct({
          variables: {
            description: description,
            price: fieldsValue['price'],
            name: fieldsValue['name'],
            stock: fieldsValue['stock'],
            tag: data.tag,
            idPhotoProduct: filelist ? filelist.id : undefined,
            whereId: data.id
          }
        }).then(() => {
          message.success('Berhasil update')
          if (data.tag === "BARANG") {
            Router.push('/data-produk')
          } else {
            Router.push('/data-paket-wedding')
          }
        }
        ).catch(() => 
          message.error('error update')
        )
      }
    })
  }

  private handleChangeDescription = (content: string) => {
    this.setState({ description: content })
  }
  
  render() {
    const { filelist, description } = this.state
    const { data } = this.props
    const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form
    const nameError = isFieldTouched('name') && getFieldError('name')
    const stockError = isFieldTouched('stock') && getFieldError('stock')
    const priceError = isFieldTouched('price') && getFieldError('price')

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
              defaultPhoto={filelist && filelist.id ? filelist : data.photo}
              callback={(data: any) => this.setState({ filelist: {...data.uploadProductPhoto}})}
              refetchQueries={[{
                query: PRODUCT_QUERY,
                variables: {
                  id: data.id
                }
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
          label="Harga"
          validateStatus={priceError ? 'error' : 'success'}
          help={priceError || ''}
        >
          {getFieldDecorator('price', {
            rules: [{ required: true, message: 'tolong masukkan harga!' }],
          })(
            <Input type="number" />
          )}
        </FormItem>
        <FormItem 
          label="stok"
          validateStatus={stockError ? 'error' : 'success'}
          help={stockError || ''}
        >
          {getFieldDecorator('stock', {
            rules: [{ required: true, message: 'tolong masukkan stok!' }],
          })(
            <Input type="number" />
          )}
        </FormItem>
        <FormItem 
          label="Deskripsi"
        >
          {
            ReactQuill 
              ? <ReactQuill
                  value={description}
                  onChange={this.handleChangeDescription}
                /> 
              : <p>Fallback for SSR</p>
          }
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
  graphql<{}, UploadProductPhotoMutation, UploadProductPhotoMutationVariables, {}>(UPLOAD_PRODUCT_PHOTO, {
    name: 'uploadPhotoMutation'
  }),
  graphql<{}, DeleteProductPhotoMutation, DeleteProductPhotoMutationVariables, {}>(DELETE_PRODUCT_PHOTO, {
    name: 'deletePhotoMutation'
  }),
  graphql<{}, UpdateProductMutation, UpdateProductMutationVariables, {}>(UPDATE_PRODUCT,{
    name: 'updateProduct'
  }),
  Form.create({}),
)(FormEditProduct)

export default WithCompose