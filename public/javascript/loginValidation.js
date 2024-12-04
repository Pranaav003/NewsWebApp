function validateAccount(f) {
    if (f.username.value.trim() === "") {
      error1.hidden = false;
      return false;
    } else if (f.password.value.trim() === "") {
      error2.hidden = false;
      return false;
    } else if (f.password.value !== f.confirm.value) {
      error3.hidden = false;
      return false;
    } 
    return true;
}

function validateLogin(f) {
    if (f.username.value.trim() === "") {
        error1.hidden = false;
        return false;
    } else if (f.password.value.trim() === "") {
        error2.hidden = false;
        return false;
    } 
    return true;
}