function showMessage(text) {
  document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: text,
    timeout: 2000,
  });
}

export default showMessage;
