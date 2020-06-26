/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum BookingStatus {
  CREATED = "CREATED",
  SEND = "SEND",
  PROCCESS = "PROCCESS",
  SUCCESS = "SUCCESS",
}


export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}


export enum ProductTag {
  BARANG = "BARANG",
  PAKETWEDDING = "PAKETWEDDING",
}


export type AddProductToBookingMutationVariables = {
  idProduct: string,
  amount: number,
  idBooking: string,
};

export type AddProductToBookingMutation = {
  addProductToBooking:  {
    __typename: "Booking",
    id: string,
    items:  Array< {
      __typename: "Item",
      id: string,
      amount: number,
      product:  {
        __typename: "Product",
        id: string,
      },
    } >,
  },
};

export type BookingQueryVariables = {
  id: string,
};

export type BookingQuery = {
  booking:  {
    __typename: "Booking",
    id: string,
    startDate: string,
    endDate: string | null,
    noWhatsApp: string | null,
    address: string | null,
    message: string | null,
    status: BookingStatus,
    userBooking:  {
      __typename: "User",
      id: string,
      name: string,
      role: Role,
    } | null,
    items:  Array< {
      __typename: "Item",
      id: string,
      amount: number,
      product:  {
        __typename: "Product",
        id: string,
        name: string,
        price: number,
      },
    } >,
  } | null,
};

export type BookingConnectionQueryVariables = {
  first: number,
  skip: number,
};

export type BookingConnectionQuery = {
  bookingConnection:  {
    __typename: "BookingConnection",
    pageInfo:  {
      __typename: "PageInfo",
      hasNextPage: boolean,
      startCursor: string | null,
      endCursor: string | null,
    },
    aggregate:  {
      __typename: "AggregateBooking",
      count: number,
    },
    edges:  Array< {
      __typename: "BookingEdge",
      node:  {
        __typename: "Booking",
        id: string,
        startDate: string,
        endDate: string | null,
        noWhatsApp: string | null,
        address: string | null,
        message: string | null,
        status: BookingStatus,
        userBooking:  {
          __typename: "User",
          id: string,
          name: string,
        } | null,
        items:  Array< {
          __typename: "Item",
          id: string,
          product:  {
            __typename: "Product",
            id: string,
          },
        } >,
      },
    } | null >,
  } | null,
};

export type BookingsFilterByDateQueryVariables = {
  dateNow: string,
};

export type BookingsFilterByDateQuery = {
  bookingsFilterByDate:  Array< {
    __typename: "DataOutput",
    date: number,
    data:  Array< {
      __typename: "Data",
      type: string,
      content: string,
    } >,
  } >,
};

export type CreateBookingMutationVariables = {
  startDate: string,
  endDate: string,
};

export type CreateBookingMutation = {
  createBooking:  {
    __typename: "Booking",
    id: string,
    startDate: string,
    endDate: string | null,
    items:  Array< {
      __typename: "Item",
      id: string,
      amount: number,
      product:  {
        __typename: "Product",
        id: string,
        name: string,
        description: string,
        price: number,
      },
    } >,
    message: string | null,
    noWhatsApp: string | null,
    address: string | null,
    status: BookingStatus,
  },
};

export type DeleteBookingMutationVariables = {
  id: string,
};

export type DeleteBookingMutation = {
  deleteBooking:  {
    __typename: "Booking",
    id: string,
  },
};

export type DeleteManyBookingMutationVariables = {
  ids: Array< string >,
};

export type DeleteManyBookingMutation = {
  deleteManyBooking:  {
    __typename: "BatchPayload",
    count: string,
  },
};

export type RemoveItemFromBookingMutationVariables = {
  idBooking: string,
  idItem: string,
};

export type RemoveItemFromBookingMutation = {
  removeItemFromBooking:  {
    __typename: "Booking",
    id: string,
    items:  Array< {
      __typename: "Item",
      id: string,
    } >,
  },
};

export type SearchBookingsByUserQueryVariables = {
  idUser: string,
  first: number,
  skip: number,
};

export type SearchBookingsByUserQuery = {
  searchBookingsByUser:  {
    __typename: "BookingConnection",
    edges:  Array< {
      __typename: "BookingEdge",
      node:  {
        __typename: "Booking",
        id: string,
        startDate: string,
        endDate: string | null,
        noWhatsApp: string | null,
        address: string | null,
        message: string | null,
        status: BookingStatus,
        items:  Array< {
          __typename: "Item",
          id: string,
          amount: number,
          product:  {
            __typename: "Product",
            id: string,
            name: string,
            price: number,
          },
        } >,
      },
    } | null >,
    aggregate:  {
      __typename: "AggregateBooking",
      count: number,
    },
  } | null,
};

export type SendBookingMutationVariables = {
  idBooking: string,
  address: string,
  noWhatsApp: string,
  message?: string | null,
};

export type SendBookingMutation = {
  sendBooking:  {
    __typename: "Booking",
    id: string,
    startDate: string,
    endDate: string | null,
    items:  Array< {
      __typename: "Item",
      id: string,
      amount: number,
      product:  {
        __typename: "Product",
        id: string,
        name: string,
        description: string,
        price: number,
      },
    } >,
    message: string | null,
    noWhatsApp: string | null,
    address: string | null,
    status: BookingStatus,
  },
};

export type UpdateStatusBookingMutationVariables = {
  status: BookingStatus,
  idBooking: string,
};

export type UpdateStatusBookingMutation = {
  updateStatusBooking:  {
    __typename: "Booking",
    id: string,
    startDate: string,
    endDate: string | null,
    noWhatsApp: string | null,
    address: string | null,
    message: string | null,
    status: BookingStatus,
    userBooking:  {
      __typename: "User",
      id: string,
      name: string,
      role: Role,
    } | null,
    items:  Array< {
      __typename: "Item",
      id: string,
      amount: number,
      product:  {
        __typename: "Product",
        id: string,
        name: string,
        price: number,
      },
    } >,
  },
};

export type CreateProductMutationVariables = {
  name: string,
  stock: number,
  price: number,
  description: string,
  tag: string,
  idPhotoProduct?: string | null,
};

export type CreateProductMutation = {
  createProduct:  {
    __typename: "Product",
    id: string,
    name: string,
    stock: number,
    price: number,
    description: string,
    photo:  {
      __typename: "ProductPhoto",
      id: string,
      key: string,
      url: string,
    } | null,
    tag: ProductTag,
  },
};

export type DeleteManyProductMutationVariables = {
  ids: Array< string >,
};

export type DeleteManyProductMutation = {
  deleteManyProduct:  {
    __typename: "BatchPayload",
    count: string,
  },
};

export type DeleteProductMutationVariables = {
  id: string,
};

export type DeleteProductMutation = {
  deleteProduct:  {
    __typename: "Product",
    id: string,
  },
};

export type DeleteProductPhotoMutationVariables = {
  idPhoto: string,
  key: string,
};

export type DeleteProductPhotoMutation = {
  deleteProductPhoto:  {
    __typename: "OnDeleteResponse",
    success: boolean,
  },
};

export type FilterProductByDateGivenQueryVariables = {
  startDate: string,
  endDate: string,
  first: number,
  skip: number,
  tag: string,
};

export type FilterProductByDateGivenQuery = {
  filterProductByDateGiven:  {
    __typename: "ProductsConnection",
    edges:  Array< {
      __typename: "ProductEdge",
      node:  {
        __typename: "Product",
        id: string,
        name: string,
        tag: ProductTag,
        photo:  {
          __typename: "ProductPhoto",
          id: string,
          key: string,
          url: string,
        } | null,
        description: string,
        price: number,
        stock: number,
      },
    } | null >,
    aggregate:  {
      __typename: "AggregateProduct",
      count: number,
    },
  } | null,
};

export type ProductQueryVariables = {
  id: string,
};

export type ProductQuery = {
  product:  {
    __typename: "Product",
    id: string,
    name: string,
    stock: number,
    description: string,
    price: number,
    tag: ProductTag,
    photo:  {
      __typename: "ProductPhoto",
      id: string,
      key: string,
      url: string,
    } | null,
  },
};

export type ProductsConnectionQueryVariables = {
  first: number,
  skip: number,
  tag: string,
};

export type ProductsConnectionQuery = {
  productsConnection:  {
    __typename: "ProductsConnection",
    edges:  Array< {
      __typename: "ProductEdge",
      node:  {
        __typename: "Product",
        id: string,
        name: string,
        photo:  {
          __typename: "ProductPhoto",
          id: string,
          key: string,
          url: string,
        } | null,
        description: string,
        stock: number,
        price: number,
      },
    } | null >,
    aggregate:  {
      __typename: "AggregateProduct",
      count: number,
    },
  } | null,
};

export type UpdateProductMutationVariables = {
  name: string,
  stock: number,
  price: number,
  description: string,
  tag: ProductTag,
  whereId: string,
  idPhotoProduct?: string | null,
};

export type UpdateProductMutation = {
  updateProduct:  {
    __typename: "Product",
    id: string,
    name: string,
    stock: number,
    price: number,
    description: string,
    photo:  {
      __typename: "ProductPhoto",
      id: string,
      key: string,
      url: string,
    } | null,
    tag: ProductTag,
  },
};

export type UploadProductPhotoMutationVariables = {
  file: string,
};

export type UploadProductPhotoMutation = {
  uploadProductPhoto:  {
    __typename: "ProductPhoto",
    id: string,
    key: string,
    url: string,
  },
};

export type DeleteManyUserMutationVariables = {
  ids: Array< string >,
};

export type DeleteManyUserMutation = {
  deleteManyUser:  {
    __typename: "BatchPayload",
    count: string,
  },
};

export type DeleteUserMutationVariables = {
  id: string,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
  },
};

export type DeleteUserPhotoMutationVariables = {
  idPhoto: string,
  key: string,
};

export type DeleteUserPhotoMutation = {
  deleteUserPhoto:  {
    __typename: "UserPhoto",
    id: string,
    key: string,
    filename: string,
    mimetype: string,
    encoding: string,
    url: string,
  },
};

export type LoginMutationVariables = {
  email: string,
  password: string,
};

export type LoginMutation = {
  login:  {
    __typename: "AuthPayload",
    token: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      email: string,
      role: Role,
    },
  },
};

export type MeQuery = {
  me:  {
    __typename: "User",
    name: string,
    email: string,
    role: Role,
    id: string,
    photo:  {
      __typename: "UserPhoto",
      id: string,
      key: string,
      url: string,
    } | null,
    bookings:  Array< {
      __typename: "Booking",
      id: string,
      startDate: string,
      endDate: string | null,
      noWhatsApp: string | null,
      address: string | null,
      message: string | null,
      items:  Array< {
        __typename: "Item",
        id: string,
        amount: number,
        product:  {
          __typename: "Product",
          id: string,
          name: string,
          description: string,
          stock: number,
          price: number,
        },
      } >,
      status: BookingStatus,
    } >,
  },
};

export type singUpMutationVariables = {
  email: string,
  password: string,
  name: string,
};

export type singUpMutation = {
  signup:  {
    __typename: "AuthPayload",
    token: string,
    user:  {
      __typename: "User",
      id: string,
      name: string,
      email: string,
      role: Role,
    },
  },
};

export type UpdateUserMutationVariables = {
  name: string,
  email: string,
  password?: string | null,
  whereId: string,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
  },
};

export type UploadUserPhotoMutationVariables = {
  file?: string | null,
};

export type UploadUserPhotoMutation = {
  uploadUserPhoto:  {
    __typename: "UserPhoto",
    id: string,
    key: string,
    filename: string,
    mimetype: string,
    encoding: string,
    url: string,
  },
};

export type UserQueryVariables = {
  id: string,
};

export type UserQuery = {
  user:  {
    __typename: "User",
    id: string,
    name: string,
    email: string,
    photo:  {
      __typename: "UserPhoto",
      id: string,
      key: string,
      url: string,
    } | null,
  },
};

export type UsersConnectionQueryVariables = {
  first: number,
  skip: number,
  role: Role,
};

export type UsersConnectionQuery = {
  usersConnection:  {
    __typename: "UsersConnection",
    aggregate:  {
      __typename: "AggregateUser",
      count: number,
    },
    edges:  Array< {
      __typename: "UserEdge",
      node:  {
        __typename: "User",
        id: string,
        name: string,
        email: string,
        photo:  {
          __typename: "UserPhoto",
          id: string,
          key: string,
          url: string,
        } | null,
      },
    } | null >,
  } | null,
};

export type BookingMenuFragment = {
  __typename: "User",
  bookings:  Array< {
    __typename: string,
    id: string,
    startDate: string,
    endDate: string | null,
    noWhatsApp: string | null,
    address: string | null,
    message: string | null,
    items:  Array< {
      __typename: string,
      id: string,
      amount: number,
      product:  {
        __typename: string,
        id: string,
        name: string,
        description: string,
        stock: number,
        price: number,
      },
    } >,
    status: BookingStatus,
  } >,
};

export type DataUserForProductFragment = {
  __typename: "User",
  bookings:  Array< {
    __typename: string,
    id: string,
    startDate: string,
    endDate: string | null,
  } >,
};

export type LoginMenuFragment = {
  __typename: "User",
  id: string,
  name: string,
  photo:  {
    __typename: string,
    id: string,
    key: string,
    url: string,
  } | null,
};
