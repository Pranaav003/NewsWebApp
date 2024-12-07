function validateAccount(f) {
  let user = f.username.value.trim()
  let pass = f.password.value.trim()

  if (user === "") {
    error1.innerHTML = 'A username is required.'
    return false
  } else if (user.includes(' ')) {
    error1.innerHTML = 'Your username must not include spaces.'
    return false;
  }else if (pass === "") {
    error2.innerHTML = 'A password is required.'
    return false
  } else if (pass.length < 6) {
    error2.innerHTML = 'The password must be at least 6 characters.'
    return false
  } else if (pass !== f.confirm.value.trim()) {
    error3.innerHTML = 'The passwords do not match.'
    return false
  } 
  return true
}

function validateLogin(f) {
  let user = f.username.value.trim()
  let pass = f.password.value.trim()

  if (user === "") {
      error1.innerHTML = 'A username is required.'
      return false
  } else if (pass === "") {
      error2.innerHTML = 'A password is required.'
      return false
  } 
  return true
}