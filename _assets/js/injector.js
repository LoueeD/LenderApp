// inyector.js
// Get the ipcRenderer of electron
const { ipcRenderer } = require('electron');

//Lender object
var lenderApp = {
  site: location.hostname,
  el: null,
  formOrdinal: 0,
  resultWait: null,
  init: function(){
    lenderApp.resultWait = document.querySelector(lenderApp.el).innerHTML;
  },
  injectData: function (){
    if(window.lenderForm[0].form[lenderApp.formOrdinal]){
      let formEl = window.lenderForm[0].form[lenderApp.formOrdinal].selector;
      let el = document.querySelector(formEl);
      console.log('Form length: ' + formEl);
      if (el) {
        if(window.lenderForm[0].form[lenderApp.formOrdinal].type === 'input' || window.lenderForm[0].form[lenderApp.formOrdinal].type === 'select'){
          let userValue = window.lenderForm[0].form[lenderApp.formOrdinal].name;
          console.log(userValue);
          el.value = window.lenderData.data[userValue];
          console.log(el.value);
        } else if (window.lenderForm[0].form[lenderApp.formOrdinal].name === 'submit'){
          el.click();
        } else if (window.lenderForm[0].form[lenderApp.formOrdinal].name === 'result'){
          lenderApp.sendResult(el.innerHTML);
        }
      }
      lenderApp.formOrdinal++;
      if(lenderApp.formOrdinal < 50){
        setTimeout(lenderApp.injectData, 200);
      }
    }
  },
  sendResult: function (result) {
    ipcRenderer.sendToHost(result);
    location.reload();
  },
  run: function() {
    // Add all user data to the form
    lenderApp.injectData();
  }
};

// Do something according to a request of your mainview
ipcRenderer.on('request', function(){
  console.log(window.lenderData, window.lenderForm);
  lenderApp.run();
});

ipcRenderer.on("alert-something",function(event,data){
  alert(data);
});
