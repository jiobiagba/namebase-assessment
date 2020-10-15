const fs = require("fs")
if( fs.existsSync("./db.json")) { fs.unlinkSync("./db.json") }

const orderBook = require("../lib/index")
const assert = require("assert")

 

const order1 = [10, 2]
const order2 = [15, 3]
const order3 = [50, 8]
const order4 = [5, 12]
const order5 = [51, 9]
const order6 = [10, 12]
const order7 = [1, 12]
const order8 = [2,12]
const order9 = [15, 13]
const order10 = [5, 1]

const firstOrder = orderBook.buy(...order1)
const secondOrder = orderBook.buy(...order2)
const thirdOrder = orderBook.sell(...order3)
orderBook.sell(...order4)
orderBook.buy(...order5)
orderBook.sell(...order6)
orderBook.sell(...order7)
orderBook.sell(...order8)

const orderBookState = orderBook.sync("db.json")

describe("Testing Order Book IDs", function() {
    it("should have 1 as first order id", function() {
        assert.deepStrictEqual(firstOrder.id, 1)
    })
    it("should have 2 as second order id", function() {
        assert.deepStrictEqual(secondOrder.id, 2)
    })
    it("should have 3 as third order id", function() {
        assert.deepStrictEqual(thirdOrder.id, 3)
    })
})

describe("Testing Returned Valued During Order Book Sync", function() {
    it("should not contain BUY orders that have been completed", function() {
        assert.deepStrictEqual(
            orderBookState.executableBuyOrders.filter(
                (order) => {
                    return order.quantity === order.executedQuantity
                }
            ),
            []
        )
    })
    it("should not contain SELL orders that have been completed", function() {
        assert.deepStrictEqual(
            orderBookState.executableSellOrders.filter(
                (order) => {
                    return order.quantity === order.executedQuantity
                }
            ),
            []
        )
    } )
})


describe("Testing BUYS that need updates", function() {
    it("should get give available order as 1 for 5th order", function() {
        assert.deepStrictEqual(
            orderBookState.executableBuyOrders.filter(
                (order) => {
                    return order.id === 5 && (order.quantity - order.executedQuantity) === 1
                }
            )[0].id,
            5
        )
    })
})

describe("Testing SELLS with the same price", function() {
    it("should have id as 4 when quantity is 5 for orders with price as 12", function() {
        assert.deepStrictEqual(
            orderBookState.executableSellOrders.filter(
                (order) => {
                    return order.price === 12
                }
            )[0].id,
            4
        ) 
    })
})

orderBook.buy(...order9)
const orderBookState2 = orderBook.sync("db.json")

describe("Testing Returned Values During ORder Book Sync AGAIN", function() {
    it("should not contain BUY orders that have been completed", function() {
        assert.deepStrictEqual(
            orderBookState2.executableBuyOrders.filter(
                (order) => {
                    return order.quantity === order.executedQuantity
                }
            ),
            []
        )
    })
    it("should not contain SELL orders that have been completed", function() {
        assert.deepStrictEqual(
            orderBookState2.executableSellOrders.filter(
                (order) => {
                    return order.quantity > order.executedQuantity
                }
            ).length,
            2
        )
    })
})

describe("Testing Quantity By Price and By ID", function() {
    it("should return 3 for orders available at price 12", function() {
        assert.deepStrictEqual(orderBook.getQuantityAtPrice(12), 3)
    })
    it("should show executedQuantity equals quantity for id 9", function() {
        assert.deepStrictEqual(orderBook.getOrder(9).executedQuantity, 15)
        assert.deepStrictEqual(orderBook.getOrder(9).quantity, 15)
    })
})

orderBook.sell(...order10)
const orderBookState3 = orderBook.sync("db.json")

describe("Further Tests on SELLs", function() {
    it("should not have id of 5 in sync after placing order 10", function() {
        assert.deepStrictEqual(
            orderBookState3.executableBuyOrders.filter(
                (order) => {
                    return order.id === 5
                }
            ),
            []
        )
    })
})