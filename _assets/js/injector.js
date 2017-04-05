// inyector.js
// Get the ipcRenderer of electron
const { ipcRenderer } = require('electron');
// document.createElement('script').src = "https://cdn.rawgit.com/uzairfarooq/arrive/master/minified/arrive.min.js";

//Lender object
var lenderApp = {
  site: location.hostname,
  el: null,
  resultWait: null,
  init: function(){
    lenderApp.resultWait = document.querySelector(lenderApp.el).innerHTML;
  },
  injectData: function (formEl, id, data){
    var el = document.querySelector(id);
    if(formEl === 'input' || formEl === 'select'){
      el.value = data;
    }else if(formEl === 'click'){
      el.click();
    }
  },
  getResult: function () {
    var v = document.querySelector(lenderApp.el).innerHTML;
    if(lenderApp.resultWait === v) {
      setTimeout(lenderApp.getResult, 500);
    }else{
      ipcRenderer.sendToHost(document.querySelector(lenderApp.el).innerHTML);
      location.reload();
    }
  },
  run: function() {
    for( var prop in window.lenderForm) {
      if(window.lenderData.data[prop] === '_SUBMIT'){
        document.querySelector(prop).click();
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

for( var prop in window.lenderData.data) {
  if(window.lenderData.data[prop] === '_RESULT'){
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
