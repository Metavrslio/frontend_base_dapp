const UMC = artifacts.require("UMC");

module.exports = function (deployer) {
  deployer.deploy(UMC, "Name", "Symbol", "http://ipfs.com", "http://ipfs.com", "8888");
};
