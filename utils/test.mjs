export const createString = (length) => {
  let string = ''
  let possible = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < length; i++) { string += possible.charAt(Math.floor(Math.random() * possible.length)) }
  return string
}
