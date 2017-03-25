(function() {
  const webview = document.querySelector('#halifax')
  var app = new Vue({
    el: '#app',
    data: {
      lender: {
        page: 'dashboardView'
      },
      clientView: {
        id: null,
        name: null
      },
      clients: [{
          id: 1,
          name: 'Louis Dickinson',
          data: { adults: 2, children: 0, amount: 150000, term: 25, ddlhelptobuy: 'No', income1: 150000
          }
        },{
          id: 2,
          name: 'David Cross',
          data: { adults: null, children: null, amount: null, term: null, ddlhelptobuy: '', income1: ''
          }
        },{
          id: 3,
          name: 'Emma Watson',
          data: { adults: null, children: null, amount: null, term: null, ddlhelptobuy: '', income1: ''
          }
        },{
          id: 4,
          name: 'Sherlock Homes',
          data: { adults: null, children: null, amount: null, term: null, ddlhelptobuy: '', income1: ''
          }
        },{
          id: 5,
          name: 'Tony Stark',
          data: { adults: null, children: null, amount: null, term: null, ddlhelptobuy: '', income1: ''
          }
        },{
          id: 6,
          name: 'Sherlock Homes',
          data: { adults: null, children: null, amount: null, term: null, ddlhelptobuy: '', income1: ''
          }
        },{
          id: 7,
          name: 'Troye Sivan',
          data: { adults: null, children: null, amount: null, term: null, ddlhelptobuy: '', income1: ''
          }
        }
      ],
    },
    methods: {
      launchClient: function (client) {
        this.clientView = client;
        this.lender.page = 'clientView';
      },
      goBack: function() {
        var page = this.lender.page;
        if(page == 'gettingResults') {
          page = 'clientView';
        } else {
          page = 'dashboardView';
        }
        this.lender.page = page;
      },
      addClient: function() {
        this.clients.push({
          id: this.clients.length + 1,
          name: 'Testing',
          data: {
            adults: null,
            children: null,
            amount: null,
            term: null,
            ddlhelptobuy: '',
            income1: ''
          }
        });
      },
      getResults: function() {
        // webview.openDevTools();
        var self = this;
        this.lender.page = 'gettingResults';
        webview.executeJavaScript(self.clientData(), function(){
          webview.send("request");
        });
      },
      saveLocalStorage: function() {
        localStorage.setItem('data', JSON.stringify(this.getInputValue()));
      },
      loadLocalStorage: function() {
        var store = JSON.parse(localStorage.getItem('data'));
        if ( store ) {
          fullname.value = store.fullname;
          address.value = store.address;
        }
      },
      clearLocalStorage: function() {
        localStorage.removeItem('data');
      },
      getInputValue: function() {
        return {
          fullname: fullname.value,
          address: address.value
        }
      },
      clientData: function() {
        var lenderFormData = {
          adults: document.querySelector('input[name="adults"]').value,
          children: document.querySelector('input[name="children"]').value,
          amount: document.querySelector('input[name="amount"]').value,
          term: document.querySelector('input[name="term"]').value,
          ddlhelptobuy: document.querySelector('select[name="ddlhelptobuy"] option[selected]').value,
          income1: document.querySelector('input[name="income1"]').value
        };
        return `window.lenderData = {
          ctl00_ContentPlaceHolder_ctl00_adults: ` + lenderFormData.adults + `,
          ctl00_ContentPlaceHolder_ctl00_children: ` + lenderFormData.children + `,
          ctl00_ContentPlaceHolder_ctl00_amount: ` + lenderFormData.amount + `,
          ctl00_ContentPlaceHolder_ctl00_term: ` + lenderFormData.term + `,
          ctl00_ContentPlaceHolder_ctl00_ddlhelptobuy: '` + lenderFormData.ddlhelptobuy + `',
          ctl00_ContentPlaceHolder_ctl00_annualincome1: ` + lenderFormData.income1 + `,
          ctl00_ContentPlaceHolder_ctl00_submitproduct: "_SUBMIT",
          ctl00_ContentPlaceHolder_ctl00_loanamount: "_RESULT"
        };`;
      }
    }
  });

  // var stage = 0;
  // function santanderGetResult() {
  //   if(stage == 0) {
  //     document.querySelector('label[for=rbApplicationTypeSingle]').click();
  //     document.querySelector('label[for=rbOwnedAPropertyYes]').click();
  //     document.querySelector('#tbLoanTermYears').value = 22;
  //     document.querySelector('#tbDeposit').value = 170000;
  //     document.querySelector('label[for=rbEquityLoanSchemeNo]').click();
  //     document.querySelector('label[for=rbOtherPropertiesNo]').click();
  //     document.querySelector('#btnContinue').click();
  //     stage = 1;
  //     setTimeout(santanderGetResult,800);
  //   } else if(stage == 1) {
  //     document.querySelector('#tbPermanentEmploymentBasicSalary1').value = 80000;
  //     document.querySelector('#btnContinue').click();
  //     stage = 2;
  //     setTimeout(santanderGetResult,800);
  //   } else if(stage == 2) {
  //     document.querySelector('label[for=rbMonthlyExpenditureNo]').click();
  //     document.querySelector('label[for=rbNonRegularMonthlyExpenditureNo]').click();
  //     document.querySelector('#btnContinue').click();
  //     stage = 3;
  //     setTimeout(santanderGetResult,800);
  //   } else if(stage == 3) {
  //      console.log(document.querySelector('.affordResultsWrap span').innerHTML);
  //   }
  // }
  // santanderGetResult();

  // Process the data from the webview
  webview.addEventListener('ipc-message',function(event){
    var data = event.channel;
    //alert();
    document.querySelector('li[data-results=halifax] span').innerHTML = data;
    // console.log(event);
    // var el = document.querySelector('.results');
    // el.style.display = 'block';
    // el.innerHTML = el.innerHTML + '<li>Halifax <span>' + event.channel + '</span></li>';
  });

  // You can also require other files to run in this process
  require('./renderer.js')
})();
