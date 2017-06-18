const request = require('supertest');
const express = require('express');

describe('Test BBT Card Services App', function () {

    var server;

    beforeEach(function (done) {
        var app = express();
        var bbtCardServices = require('../index');
        bbtCardServices.express({
            expressApp: app,
            // router: express.Router(), //deprecated
            debug: true,
            checkCert: false
        });
        server = app.listen(3000);
        done();
    });


    it('responds to invalid data', function() {
        return request(server)
            .post('/bbtCardServices')
            .send({
                request: {
                    type: "LaunchRequest",
                    requestId: "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423",
                    timestamp: "2017-06-17T20:07:21.975Z",
                    locale: "en-US"
                }
            })
            .expect(200).then(function(response) {
                return expect(response.body).to.eql({
                    version: '1.0',
                    response: {
                        directives: [],
                        shouldEndSession: true,
                        outputSpeech: {
                            type: 'SSML',
                            ssml: '<speak>Error: not a valid request</speak>'
                        }
                    },
                    sessionAttributes: {}
                });
            });
    });

    // it('BB&T card services launch event', function() {
    //     return request(server)
    //         .post('/bbtCardServices')
    //         .send({
    //             request: {
    //                 type: 'LaunchRequest',
    //             }
    //         })
    //         .expect(200).then(function(response) {
    //             var ssml = response.body.response.outputSpeech.ssml;
    //             console.log(ssml);
    //             return expect(ssml).to.eql('<speak>Welcome to b b and t\'s Credit and Debit Card Services. For usage say, Block my card ending in the last four digits of the card number.</speak>');
    //         });
    // });

    afterEach(function(done) {
        server.close();
        done();
    });

});