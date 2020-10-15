const fs = require("fs")
const dbPath = "./db.json"

var initialize = ( function() {
    if(fs.existsSync(dbPath)) {
        // File exists, do tasks on it
        const data = fs.readFileSync(dbPath)
        const orderResult = JSON.parse(data.toString())
        const startIndex = orderResult.sort((orderA, orderB) => {
            return orderB.id - orderA.id // Sorts by id in DESCENDING order
        })[0].id

        return startIndex
    } else {
        // Create file and do tasks on it
        const data = []
        fs.writeFileSync(dbPath, JSON.stringify(data))
        console.log("Writing to new file completed.")
        
        return 0
    }
})()

function writeToFile(data) {
    if( fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath) // Delete File
        fs.writeFileSync(dbPath, JSON.stringify(data)) // Recreate file and write
    } else {
        fs.writeFileSync(dbPath, JSON.stringify(data)) // Recreate file and write
    }
}

function readFromFile() {
    if( fs.existsSync(dbPath)) {
        // File exists, do tasks on it
        const data = fs.readFileSync(dbPath)
        const orderResult = JSON.parse(data.toString())
        return orderResult
    } else {
        console.error("File DOES NOT exist.")
    }
}

function preSync(fileName) {
    if( fs.existsSync(fileName)) {
        // File exists, do tasks on it
        const data = fs.readFileSync(fileName)
        const orderResult = JSON.parse(data.toString())
        return orderResult
    } else {
        console.error("File DOES NOT exist.")
    }
}

module.exports = {
    initialize,
    writeToFile,
    readFromFile,
    preSync
}