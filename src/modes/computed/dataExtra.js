const formExtras = [];

function setComputedFormExtra(formExtra) {
  formExtras.push(formExtra);
}

function getFormExtras() {
  return formExtras;
}

export {
  getFormExtras,
  setComputedFormExtra,
};
