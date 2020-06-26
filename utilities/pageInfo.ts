import { NextContextNewContext } from "lib/withApollo";

export type PageInfo = {
  first: number,
  skip: number,
  currentPage: number
}

const pageInfo = (productPerPage: number, context: NextContextNewContext) => {
  const page = context.query && context.query.page ? context.query.page : "1"
  const pageNumber = parseInt(page as string, 10)
  const isFirstPage = page === "1"
  const skip = isFirstPage ? 0 : (pageNumber - 1) * productPerPage
  const currentPage = context.query && context.query.page ? context.query.page : "1"
  return {
    first: productPerPage,
    skip: skip,
    currentPage: currentPage
  }
}

export default pageInfo