var index = require('../index');
var Mock = require('./mock');
var _ = require('lodash');
var BbtCardServicesHelper = require('../bbtCardServicesHelper.js');



describe('Test Intents: ', function () {

    var request, response;

    beforeEach(function () {

        request = Mock.getRequest();
        response = Mock.getResponse()

        spyOn(request, 'getSession').and.callThrough();
        spyOn(request.session, 'clear').and.callThrough();
        spyOn(request.session, 'set').and.callThrough();
        spyOn(request.session, 'get').and.callThrough();

        spyOn(response, 'say').and.callThrough();
        spyOn(response, 'shouldEndSession').and.callThrough();


    });

    it('Verify if index is instantiable', function () {
        expect(index).toBeDefined();
    });

    it('Verify if App name is defined', function () {
        expect(index.name).toEqual('bbtCardServices');
    });

    it('Test if intentBlock is defined in intents', function () {
        expect(index.intents['intentBlock']).toBeDefined();
    });

    it('Test if intentBlock function is defined in intents', function () {
        expect(index.intents['intentBlock']["function"]).toBeDefined();
    });

    it('Test intent Block with Credit  with Invalid Pin', function () {

        spyOn(request, "slot").and.callFake(function(type) {
            if (type === 'cardType') {
                return 'credit';
            } else if (type === 'numberSlot') {
                return '1234'
            }
        });

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
        expect(response.isSessionEnded).toBe(false);


        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('The pin number you gave me does not match. Please say your four digit pin to proceed.');
        expect(response.isSessionEnded).toBe(false);

    });


    it('Test intent Block with Credit Card With Valid Pin 1872 and Start again', function () {

        spyOn(request, "slot").and.returnValues('credit', '1872', '4782', '27604', 'credit');

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('Welcome to b b and t card services. Please be aware that sensitive account information may be spoken while using this service and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);


        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the last four digit of the credit card');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the last 4 digits of the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">4782</say-as>');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('Would you like to continue to block your credit card ending in <say-as interpret-as="digits">4782</say-as>, please say yes to confirm, or no to cancel the transaction');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('Your request to block your credit card ending in <say-as interpret-as="digits">4782</say-as> has been successfully completed. Is there anything else I can do for you today?');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Call the Block Card Function and expect NO Authentication
        var intent = index.intents['intentUnblock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the last four digit of the credit card');
        expect(response.isSessionEnded).toBe(false);
        console.log('Session Values: ', request.session.values);
        expect(_.isEmpty(request.session.values)).toBe(false);

    });



});

