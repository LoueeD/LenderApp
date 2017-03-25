// inyector.js
// Get the ipcRenderer of electron
const {ipcRenderer} = require('electron');

//Lender object
var lenderApp = {
  site: location.hostname,
  el: null,
  resultWait: null,
  init: function(){
    lenderApp.resultWait = document.getElementById(lenderApp.el).innerHTML;
  },
  injectData: function (formEl, id, data){
    var el = document.getElementById(id);
    if(formEl === 'input' || formEl === 'select'){
      el.value = data;
    }
  },
  getResult: function () {
    var v = document.getElementById(lenderApp.el).innerHTML;
    if(lenderApp.resultWait === v) {
      setTimeout(lenderApp.getResult, 500);
    }else{
      ipcRenderer.sendToHost(document.getElementById(lenderApp.el).innerHTML);
      location.reload();
    }
  },
  run: function() {
    console.log(window.lenderData);
    for( var prop in window.lenderData) {
      if(window.lenderData[prop] === '_SUBMIT'){
        document.getElementById(prop).click();
      }else if(window.lenderData[prop] === '_RESULT'){
        lenderApp.el = prop;
      }else{
        lenderApp.injectData('input', prop, window.lenderData[prop]);
      }
    }
    lenderApp.init();
    lenderApp.getResult();
  }
};

for( var prop in window.lenderData) {
  if(window.lenderData[prop] === '_RESULT'){
    lenderApp.el = prop;
  }
}

// Do something according to a request of your mainview
ipcRenderer.on('request', function(){
    lenderApp.run();
});

ipcRenderer.on("alert-something",function(event,data){
    alert(data);
});
