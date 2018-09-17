export const validateEmail = mail => {
  const regExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // eslint-disable-line
  const suffix = ['study.hs-duesseldorf.de']
  return (
    regExp.test(mail) &&
    suffix.some(suffix =>
      new RegExp(`${suffix}$`).test(mail.toLowerCase().replace(/\s/g, ''))
    )
  )
}

export const validatePassword = password => {
  const regExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,32})/
  return regExp.test(password)
}
