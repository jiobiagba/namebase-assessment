
var Exchange = ( function() {

  // Constructor
  function Order(isBuyOrder, quantity, price, executedQuantity) {
    this.id = 0
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
