
const db = require("./file-as-db")
const startIndex = db.initialize

// Function for automatically creating ids
var idMaker = (function() {
  var id = startIndex
  return function() {
    return ++id
  }
})(startIndex)

var Exchange = ( function() {

  // Constructor
  function Order(isBuyOrder, quantity, price, executedQuantity) {
    this.id = idMaker(startIndex)
    this.isBuyOrder = isBuyOrder
    this.quantity = quantity
    this.price = price
    this.executedQuantity = executedQuantity
  }

  // Methods
  function sync(fileName) {

  }

  function buy(quantity, price) {

  }

  function sell(quantity, price) {

  }

  function getQuantityAtPrice(price) {

  }

  function getOrder(id) {

  }

  return {
    sync: sync,
    buy: buy,
    sell: sell,
    getQuantityAtPrice: getQuantityAtPrice,
    getOrder: getOrder
  }
})()

module.exports = Exchange;
