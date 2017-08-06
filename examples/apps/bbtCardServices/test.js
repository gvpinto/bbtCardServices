var _ = require('lodash');

var BbtCardServicesHelper = require('./bbtCardServicesHelper.js');
//
//
// var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
// // var response = bbtCardServicesHelper.intentWithAction();
// var response = bbtCardServicesHelper.getPrompts(0);
// console.log('response: ', response);

// =================================================
// var index = require('./index.js');
// var Mock = require('./spec/mock');
//
// var request, response;
//
// request = Mock.getRequest();
// response = Mock.getResponse()
//
//
//
//
// var intent = index.intents['intentBlock']["function"];
// intent(request, response);
// =================================================

// function TestFunction() {
//
// }
// TestFunction.prototype.testFunc = function() {
//     return "It Works";
//     this.testFunc2 = function() {
//         return "It works too!";
//     }
// }
//
// console.log(TestFunction.prototype.testFunc());
// console.log(TestFunction.testFunc2());

// =================================================


// var test = require('./helper');
// console.log(test.helloWorld());

// =================================================

var bbtCardServicesHelper = new BbtCardServicesHelper({isAuth: false, action: 'launch'});
var response = bbtCardServicesHelper.intentWithAction('block', 'credit');
console.log('Launch: ', bbtCardServicesHelper.getPrompts(response.step).launch);



// var prompts = [{
//     test1: 'test message 1 ${message}'
// }, {
//     test2: 'test message 2 ${message}'
// }];
//
//
// console.log(_.template(prompts[0]['test1'])({
//     'message': 'Hello'
// }));








// var action = 'lost'
// if (['stolen', 'lost'].indexOf(action) != -1) {
//     console.log('found:', action);
// } else {
//     console.log('NOT found:', action);
// }
//
// var action = 'stolen'
// if (['stolen', 'lost'].indexOf(action) != -1) {
//     console.log('found:', action);
// } else {
//     console.log('NOT found:', action);
// }
//
// var action = ''
// if (['stolen', 'lost'].indexOf(action) != -1) {
//     console.log('found:', action);
// } else {
//     console.log('NOT found:', action);
// }
//
// action = 'something'
// if (['stolen', 'lost'].indexOf(action) != -1) {
//     console.log('found:', action);
// } else {
//     console.log('NOT found:', action);
// }
//
// action = null;
// if (['stolen', 'lost'].indexOf(action) != -1) {
//     console.log('found:', action);
// } else {
//     console.log('NOT found:', action);
// }
//
// action = undefined;
// if (['stolen', 'lost'].indexOf(action) != -1) {
//     console.log('found:', action);
// } else {
//     console.log('NOT found:', action);
// }