var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "bulb light hero agree drip nephew garbage loud plastic exist day peace";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"),
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
};
