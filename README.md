# Order Book Challenge

## INTRODUCTION
This repository contains my solution to the namebase order book challenge. In solving this challenge, I used the following:

## TECHNICAL SKILLS EMPLOYED
* Classic JavaScript with the use of **IIFEs** and the **Revealing Module Pattern** for the main object export
* JavaScript Array Methods especially **filter, sort, and reduce**
* A file which serves as a database which stores data in the form of JSON. Manipulation is done using Node.js's File System (fs) module
* Tests' implementation with Mocha (the only external package used) and Node.js's assert module

## MAIN FILES
The major files apart from the package.json file are:
* file-as-db.js: Located in the lib folder, **this file contains functionalities which allows reading from, and writing to, the db.json file.** This is to mirror the behaviour of a database
* index.js: Located in the lib folder, **this file contains the logic needed for the Exchange class which helps in the order book manipulation.**
* test.js: Located in the test folder, this file **contains tests for verifying the functionality of the exported Exchange class**.

## TESTING
Follow the following steps:
1. Run `git clone https://github.com/jiobiagba/namebase-assessment.git && cd namebase-assessment ` to clone the reopsitory to your local device and be in the project's base directory
2. Run `npm install` to install the dependency
3. Run `mocha test` to verify tests
