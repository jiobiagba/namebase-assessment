
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

  /**
   * Recover the state of the order book from the specified file
   * By default, this file is db.json and is stored in the same directory
   * as index.js
   * @param {string} fileName 
   */
  function sync(fileName) {
    let allOrders = db.preSync(`./${fileName}`)
    return currrentState = {
        executableBuyOrders: 
            allOrders.filter(
                (order) => {
                    return order.isBuyOrder === true && order.quantity > order.executedQuantity
                }
            )
            .sort((orderA, orderB) => orderB.price - orderA.price)
            .sort((orderA, orderB) => orderA === orderB && orderA.id - orderB.id), // DESC by price
        executableSellOrders: 
            allOrders.filter(
                (order) => {
                    return order.isBuyOrder === false && order.quantity > order.executedQuantity
                }
            )
            .sort((orderA, orderB) => orderA.price - orderB.price) // ASC by price
            .sort((orderA, orderB) => orderA === orderB && orderA.id - orderB.id)
    }
  }

  /**
   * Adds a buy order to the db. At a high level, it checks if there are matching
   * sell orders or not before adding
   * @param {number} quantity 
   * @param {number} price 
   */
  function buy(quantity, price) {
    const newBuyOrder = new Order(true, quantity, price, 0)

    let orders = db.readFromFile()
    
    // Get all executable sell orders less than or equal to the price, sorted by price in asc order
    const executableSellOrders = orders.filter(
        (order) => {
            return order.isBuyOrder === false && order.price <= price && order.quantity > order.executedQuantity
        }
    )
    .sort((orderA, orderB) => orderA.price - orderB.price)
    .sort((orderA, orderB) => orderA === orderB && orderA.id - orderB.id)

    const otherSellOrders = orders.filter(
        (order) => {
            return order.isBuyOrder === false && order.price <= price && order.quantity === order.executedQuantity
        }
    )

    const invalidSellOrders = orders.filter(
        (order) => {
            return order.isBuyOrder === false && order.price > price
        }
    )

    // Scenario A: No matching sell orders
    if( executableSellOrders.length === 0) {
        orders.push(newBuyOrder)
        db.writeToFile(orders)
        return newBuyOrder
    }

    //Scenario B with 3 possible sub-scenarios
    if( executableSellOrders.length > 0) {
        let index = 0
        while( index < executableSellOrders.length) {
            let a = executableSellOrders[index].quantity - executableSellOrders[index].executedQuantity, b = newBuyOrder.quantity - newBuyOrder.executedQuantity

            // Scenario B1: Current Sell order doesn't fully satisfy the incoming buy order
            if( a < b ) {
                newBuyOrder.executedQuantity = newBuyOrder.executedQuantity + a
                executableSellOrders[index].executedQuantity = executableSellOrders[index].quantity
                const newerSell = executableSellOrders[index]
                executableSellOrders.splice(index, 1, newerSell)
                index++
            } else 
            // Scenario B2: Current Sell order exactly satisfies the incoming buy order
            if( a === b) {
                newBuyOrder.executedQuantity = newBuyOrder.executedQuantity + a
                executableSellOrders[index].executedQuantity = executableSellOrders[index].quantity
                const newerSell = executableSellOrders[index]
                executableSellOrders.splice(index, 1, newerSell)
                index = index + executableSellOrders.length // This ensures while loop is exited
            } else
            // Scenario B3: Current Sell order over satisfies the incoming buy order
            if ( a > b ) {
                newBuyOrder.executedQuantity = newBuyOrder.quantity
                executableSellOrders[index].executedQuantity = executableSellOrders[index].executedQuantity + b
                const newerSell = executableSellOrders[index]
                executableSellOrders.splice(index, 1, newerSell)
                index = index + executableSellOrders.length // This ensures while loop is exited
            }
        }

        orders = orders.filter((order) => { return order.isBuyOrder === true }).concat(executableSellOrders, otherSellOrders, invalidSellOrders)
        orders.push(newBuyOrder)
        db.writeToFile(orders)
        return newBuyOrder
    }
  }

  /**
   * Adds a sell order to the db. At a high level, it checks if there are matching
   * buy orders or not before adding
   * @param {number} quantity 
   * @param {number} price 
   */
  function sell(quantity, price) {
      const newSellOrder = new Order(false, quantity, price, 0)

      let orders = db.readFromFile()
      
      // Get all executable sell orders less than or equal to the price, sorted by price in asc order
      const executableBuyOrders = orders.filter(
          (order) => {
              return order.isBuyOrder === true && order.price >= price && order.quantity > order.executedQuantity
          }
      )
      .sort((orderA, orderB) => orderB.price - orderA.price)
      .sort((orderA, orderB) => orderA === orderB && orderA.id - orderB.id)

      const otherBuyOrders = orders.filter(
          (order) => {
              return order.isBuyOrder === true && order.price >= price && order.quantity === order.executedQuantity
          }
      )

      const invalidBuyOrders = orders.filter(
          (order) => {
              return order.isBuyOrder === true && order.price < price
          }
      )

      // Scenario A: No matching sell orders
      if( executableBuyOrders.length === 0) {
          orders.push(newSellOrder)
          db.writeToFile(orders)
          return newSellOrder
      }

      //Scenario B with 3 possible sub-scenarios
      if( executableBuyOrders.length > 0) {
          let index = 0
          while( index < executableBuyOrders.length) {
              let a = executableBuyOrders[index].quantity - executableBuyOrders[index].executedQuantity, b = newSellOrder.quantity - newSellOrder.executedQuantity

              // Scenario B1: Current buy order doesn't fully satisfy the incoming sell order
              if( a < b ) {
                  newSellOrder.executedQuantity = newSellOrder.executedQuantity + a
                  executableBuyOrders[index].executedQuantity = executableBuyOrders[index].quantity
                  const newerBuy = executableBuyOrders[index]
                  executableBuyOrders.splice(index, 1, newerBuy)
                  index++
              } else 
              // Scenario B2: Current Sell order exactly satisfies the incoming buy order
              if( a === b) {
                  newSellOrder.executedQuantity = newSellOrder.executedQuantity + a
                  executableBuyOrders[index].executedQuantity = executableBuyOrders[index].quantity
                  const newerBuy = executableBuyOrders[index]
                  executableBuyOrders.splice(index, 1, newerBuy)
                  index = index + executableBuyOrders.length // This ensures while loop is exited
              } else
              // Scenario B3: Current Sell order over satisfies the incoming buy order
              if ( a > b ) {
                  newSellOrder.executedQuantity = newSellOrder.quantity
                  executableBuyOrders[index].executedQuantity = executableBuyOrders[index].executedQuantity + b
                  const newerBuy = executableBuyOrders[index]
                  executableBuyOrders.splice(index, 1, newerBuy)
                  index = index + executableBuyOrders.length // This ensures while loop is exited
              }
          }

          orders = orders.filter((order) => { return order.isBuyOrder === false }).concat(executableBuyOrders, otherBuyOrders, invalidBuyOrders)
          orders.push(newSellOrder)
          db.writeToFile(orders)
          return newSellOrder
      }
  }


  /**
   * Retrieves the total number of order quantities that can be bought
   * or sold at a given price
   * @param {number} price 
   */
  function getQuantityAtPrice(price) {
      let orders = db.readFromFile()
      return orders.filter(
          (order) => {
              return order.price === price && order.quantity > order.executedQuantity
          }
      ).reduce((prevTotal, nextOrder) => {
          return prevTotal + nextOrder.quantity
      }, 0)
  }

  /**
   * Retrieves the state of an old order
   * @param {number} id 
   */
  function getOrder(id) {
      let orders = db.readFromFile()
      return orders.filter(
          (order) => {
              return order.id === id
          }
      )[0]
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
