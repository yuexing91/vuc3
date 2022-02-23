let formExtras = [];

function setDataFormExtra(formExtra) {
  formExtras.push(formExtra);
}

function getFormExtras() {
  return formExtras;
}

export {
  getFormExtras,
  setDataFormExtra,
};
