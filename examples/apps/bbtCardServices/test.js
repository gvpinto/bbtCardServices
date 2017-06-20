var _ = require('lodash');

var prompts = [{
    test1: 'test message 1 ${message}'
}, {
    test2: 'test message 2 ${message}'
}];


console.log(_.template(prompts[0]['test1'])({
    'message': 'Hello'
}));

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