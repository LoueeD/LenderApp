(function() {
  // Lender APP
  const halifax = document.querySelector('#halifax')

  window.app = new Vue({
    el: '#app',
    data: {
      lender: {
        page: 'dashboardView'
      },
      settings: {
        halifax: {
          state: true,
          url: 'https://www.halifax-intermediaries.co.uk/tools_and_calculators/mortgage_affordability_calculator/default.aspx'
        },
        santander: {
          state: false,
          url: 'https://google.co.uk'
        },
        natwest: {
          state: false,
          url: 'https://google.co.uk'
        },
        barclays: {
          state: false,
          url: 'https://google.co.uk'
        }
      },
      sourceSites: [{
        name: 'halifax',
        form: [{
          name: 'numberOfAdults',
          selector: '#ctl00_ContentPlaceHolder_ctl00_adults',
          type: 'input'
        },{
          name: 'numberOfChildren',
          selector: '#ctl00_ContentPlaceHolder_ctl00_children',
          type: 'input'
        },{
          name: 'loanAmount',
          selector: '#ctl00_ContentPlaceHolder_ctl00_amount',
          type: 'input'
        },{
          name: 'termYears',
          selector: '#ctl00_ContentPlaceHolder_ctl00_term',
          type: 'input'
        },{
          name: 'ddlhelptobuy',
          selector: '#ctl00_ContentPlaceHolder_ctl00_ddlhelptobuy',
          type: 'select'
        },{
          name: 'annualIncome1',
          selector: '#ctl00_ContentPlaceHolder_ctl00_annualincome1',
          type: 'input'
        }],
        submit: {
          selector: '#ctl00_ContentPlaceHolder_ctl00_submitproduct'
        },
        result: {
          selector: '#ctl00_ContentPlaceHolder_ctl00_loanamount'
        }
      },{
        name: 'santander',
        form: [{
            name: 'numberOfAdults',
            selector: '#ctl00_ContentPlaceHolder_ctl00_adults',
            type: 'input'
          }
        ]
      }],
      clientView: {
        id: null,
        name: null,
        data: null
      },
      clients: [{
          id: 1,
          name: 'Louis Dickinson',
          data: {
            numberOfAdults: 2,
            numberOfChildren: 0,
            loanAmount: 150000,
            termYears: 25,
            ddlhelptobuy: 'No',
            annualIncome1: 150000
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
        let self = this;
        this.lender.page = 'gettingResults';

        halifax.addEventListener("dom-ready", function() {
          halifax.openDevTools();
          halifax.executeJavaScript(self.clientData(), function(){
            halifax.send("request");
          });
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
        return  "window.lenderData = JSON.parse('" + JSON.stringify(app.clientView) + "')" +
                "window.lenderForm = JSON.parse('" + JSON.stringify(app.sourceSites) + "')";
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
  //     santanderGetResult();
  //   } else if(stage == 1) {
  //     document.arrive('#tbPermanentEmploymentBasicSalary1', function() {
  //       document.querySelector('#tbPermanentEmploymentBasicSalary1').value = 80000;
  //       document.querySelector('#btnContinue').click();
  //       stage = 2;
  //       santanderGetResult();
  //     });
  //   } else if(stage == 2) {
  //     document.arrive('label[for=rbMonthlyExpenditureNo]', function() {
  //       document.querySelector('label[for=rbMonthlyExpenditureNo]').click();
  //       document.querySelector('label[for=rbNonRegularMonthlyExpenditureNo]').click();
  //       document.querySelector('#btnContinue').click();
  //       stage = 3;
  //       santanderGetResult();
  //     });
  //   } else if(stage == 3) {
  //     document.arrive('.affordResultsWrap span', function() {
  //       alert(document.querySelector('.affordResultsWrap span').innerHTML);
  //    });
  //   }
  // }
  // santanderGetResult();

  halifax.addEventListener("dom-ready", function() {
    console.log('FIRE');
  });

  // Process the data from the webview
  halifax.addEventListener('ipc-message',function(event){
    var data = event.channel;
    document.querySelector('li[data-results=halifax] span').innerHTML = data;
  });

  // You can also require other files to run in this process
  require('./renderer.js')
})();
