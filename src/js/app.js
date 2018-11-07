App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    // Load paintings.
    $.getJSON('../paintings.json', function (data) {
      var paintingsRow = $('#paintingsRow');
      var paintingTemplate = $('#paintingTemplate');

      for (i = 0; i < data.length; i++) {
        paintingTemplate.find('.panel-title').text(data[i].name);
        paintingTemplate.find('img').attr('src', data[i].picture);
        paintingTemplate.find('.painting-location').text(data[i].location);
        paintingTemplate.find('.btn-buy').attr('data-id', data[i].id);

        paintingsRow.append(paintingTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Painting.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PaintingArtifact = data;
      App.contracts.Painting = TruffleContract(PaintingArtifact);

      // Set the provider for our contract
      App.contracts.Painting.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the sold paintings
      return App.markSold();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-buy', App.handleBuy);

  },
  
  markSold: function (customers, account) {
    var paintingInstance;

    App.contracts.Painting.deployed().then(function (instance) {
      paintingInstance = instance;

      return paintingInstance.getCustomers.call();
    }).then(function (customers) {
      for (i = 0; i < customers.length; i++) {
        if (customers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-painting').eq(i).find('button').text('Sold').attr('disabled', true);
          $('.panel-painting').eq(i).find('a').text(customers[i]);
        }
        else {
          $('.panel-painting').eq(i).find('a').text('0x')
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });

  },

  handleBuy: function (event) {
    event.preventDefault();

    var paintingId = parseInt($(event.target).data('id'));

    var paintingInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Painting.deployed().then(function (instance) {
        paintingInstance = instance;

        // Execute adopt as a transaction by sending account
        return paintingInstance.buy(paintingId, { from: account });
      }).then(function (result) {
        return App.markSold();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
