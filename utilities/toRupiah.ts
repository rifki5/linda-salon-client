const splitNumber = (numString: string) => {
  let result = ''
  for (let i = numString.length ; i > 0; i--) {
    if (i % 3 === 0 && numString.length !== i) {
      result = result.concat(`.${numString[numString.length - i]}`)
    } else {
      result = result.concat(numString[numString.length - i])
    }
  }
  return result
}

const toRupiah = (number: number) => {
  const numbString = number.toString()
  const splitNumb = splitNumber(numbString)
  return `Rp. ${splitNumb},-`
}

export default toRupiah