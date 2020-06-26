import { Component } from 'react'
import { Form, Input, Row, message, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { graphql, compose, MutationFunc } from 'react-apollo'
import { CreateProductMutation, CreateProductMutationVariables, DeleteProductPhotoMutation, DeleteProductPhotoMutationVariables, UploadProductPhotoMutation, UploadProductPhotoMutationVariables } from 'types/schema-types'
import UPLOAD_PRODUCT_PHOTO2 from 'queries/product/uploadProductPhotoM.graphql'
import DELETE_PRODUCT_PHOTO3 from 'queries/product/deleteProductPhoto.graphql'
import CREATE_PRODUCT from 'queries/product/createProduct.graphql'
import UploadFormUser from 'components/uploadFormUser'
import hasErrors from 'utilities/hasError'
import Router from 'next/router'
import FILTER_PRODUCT_QUERY3 from 'queries/product/filterProductByDateGivenQ.graphql'
import dateNow from 'utilities/dateNow'
const ReactQuill = typeof document !== 'undefined' && require('react-quill').default

type FuncMutation = {
  uploadPhotoMutation: MutationFunc<UploadProductPhotoMutation, UploadProductPhotoMutationVariables>,
  deletePhotoMutation: MutationFunc<DeleteProductPhotoMutation, DeleteProductPhotoMutationVariables>,
  createProduct: MutationFunc<CreateProductMutation, CreateProductMutationVariables>,
}

type Props = {
  tag: "BARANG" | "PAKETWEDDING"
} 
  & FormComponentProps
  & FuncMutation

type State = typeof initialState

const initialState = {
  filelist: {} as any,
  description: ''
}

const FormItem = Form.Item

class FormAddProduct extends Component<Props, State> {
  readonly state: State = initialState

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  private handleChangeDescription = (content: string) => {
    this.setState({ description: content })
  }

  private handleSubmit = (e) => {
    e.preventDefault()
    const { createProduct, form, tag } = this.props
    const { filelist, description } = this.state
    const route = tag === "BARANG" ? "/data-produk" : "/data-paket-wedding"
    form.validateFields((err, fieldsValue) => {
      if (!err && createProduct && filelist && filelist.id && description !== '') {
        createProduct({
          variables: {
            name: fieldsValue['name'],
            description: description,
            price: fieldsValue['price'],
            stock: fieldsValue['stock'],
            tag ,
            idPhotoProduct: filelist.id
          },
          refetchQueries: [{
            query: FILTER_PRODUCT_QUERY3,
            variables: {
              first: 12,
              skip: 0,
              tag,
              startDate: dateNow,
              endDate: dateNow
            }
          }]
        }).then(() => {
          message.success('Berhasil tambah produk')
          Router.push(route)
        }
        ).catch(() => 
          message.error('error tambah produk')
        )
      }
    })
  }
  
  render() {
    const { filelist, description } = this.state
    const { isFieldTouched, getFieldError, getFieldDecorator, getFieldsError } = this.props.form
    const nameError = isFieldTouched('name') && getFieldError('name')
    const priceError = isFieldTouched('price') && getFieldError('price')
    const stockError = isFieldTouched('stock') && getFieldError('stock')
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
              defaultPhoto={filelist}
              callback={(data: any) => this.setState({ filelist: {...data.uploadProductPhoto}})}
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
          label="Stok"
          validateStatus={stockError ? 'error' : 'success'}
          help={stockError || ''}
        >
          {getFieldDecorator('stock', {
            rules: [{ required: true, message: 'tolong masukkan stock!' }],
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
            Tambah Produk
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const FormAddProductWithCompose = compose(
  graphql<{}, UploadProductPhotoMutation, UploadProductPhotoMutationVariables, {}>(UPLOAD_PRODUCT_PHOTO2, {
    name: 'uploadPhotoMutation'
  }),
  graphql<{}, DeleteProductPhotoMutation, DeleteProductPhotoMutationVariables, {}>(DELETE_PRODUCT_PHOTO3, {
    name: 'deletePhotoMutation'
  }),
  graphql<{}, CreateProductMutation, CreateProductMutationVariables, {}>(CREATE_PRODUCT,{
    name: 'createProduct'
  }),
  Form.create({}),
)(FormAddProduct)

export default FormAddProductWithCompose