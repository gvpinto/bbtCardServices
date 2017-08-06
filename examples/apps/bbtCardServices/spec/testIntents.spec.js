var index = require('../index');
var Mock = require('./mock');
var _ = require('lodash');
var BbtCardServicesHelper = require('../bbtCardServicesHelper.js');
var SESSION_KEY = 'cardServiceSessionKey';

var confirmTravelVerbiage = 'Would you like to go ahead and notify bb and t that you\'ll be travelling internationally from <say-as interpret-as="date" format="ymd">2017-09-01</say-as> to <say-as interpret-as="date" format="ymd">2017-10-15</say-as> for you card ending in <say-as interpret-as="digits">4782</say-as>';

var welcomeVerbiage = 'Welcome to b b and t card services. Please be aware, that sensitive account information may be spoken while using this service, and it is possible that the information may be overheard by others around you. Please say your four digit pin to proceed.';

var askForPinAgainVerbiage = 'The given pin number does not match our records. Please say your four digit pin to proceed.';

var askWhatCanBeDoneTodayVerbiage = 'What would you like to do today. To block a card, say, I would like to block my card, or for lost or stolen card say, I have lost my credit card, and for international travel say, I will be travelling out of the country.';

var askForZipcodeForCreditCardVerbiage = 'What\'s the Zip Code associated with the credit card ending in <say-as interpret-as="digits">4782</say-as>';

var askToConfirmBlockCreditCardVerbiage = 'Would you like to continue to block your credit card ending in <say-as interpret-as="digits">4782</say-as>, please say yes to confirm, or no to cancel the transaction';

var blockCreditCardConfirmationVerbiage = 'Your request to block your credit card ending in <say-as interpret-as="digits">4782</say-as> has been successfully completed. Is there anything else I can do for you today?';

var askForCardNumberForTravelVerbiage = 'What\'s the last four digit of the credit card you would like to use internationally';

var bbtpceVerbiage = 'Is there anything else, I can help you with?';

var signOffVerbiage = 'Thank you for banking with b b and t. Have a nice day!';


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

        // spyOn(request, "slot").and.callFake(function(type) {
        //     if (type === 'cardType') {
        //         return 'credit';
        //     } else if (type === 'numberSlot') {
        //         return '1234'
        //     }
        // });
        spyOn(request, "slot").and.returnValues('credit', '1234');

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(welcomeVerbiage);
        expect(response.isSessionEnded).toBe(false);


        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForPinAgainVerbiage);
        expect(response.isSessionEnded).toBe(false);

    });


    it('Test intent Block with Credit Card With Valid Pin 1872 and Start again', function () {

        spyOn(request, "slot").and.returnValues('credit', '1872', '4782', '27604', 'credit');

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(welcomeVerbiage);
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
        expect(response.text).toBe(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askToConfirmBlockCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(blockCreditCardConfirmationVerbiage);
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

    it('Test block intent with Credit Card With Valid Pin 1872 and Start again, but Start at Launch Intent', function () {

        spyOn(request, "slot").and.returnValues('1872', 'credit', '4782', '27604', 'credit');

        // Start with Launch
        var intent = index.launchFunc;
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(welcomeVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askWhatCanBeDoneTodayVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // 'What\'s the last four digit of the credit card'
        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the last four digit of the credit card');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        // //
        //
        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        //
        // Say the last 4 digits of the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askToConfirmBlockCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        //
        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(blockCreditCardConfirmationVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        //
        // Call the Block Card Function and expect NO Authentication
        var intent = index.intents['intentUnblock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the last four digit of the credit card');
        expect(response.isSessionEnded).toBe(false);
        console.log('Session Values: ', request.session.values);
        expect(_.isEmpty(request.session.values)).toBe(false);

    });


    it('Test intent Travel without dates but with Valid Pin 1872 and Start again', function () {

        spyOn(request, "slot").and.returnValues('1872', '2017-09-01', '2017-10-15', '4782', '27604');

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentTravel']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(welcomeVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);


        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What dates will you be travelling');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values.isAuth)).toBe(true);

        // Say the last 4 digits of the card number
        var intent = index.intents['intentTravelDates']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForCardNumberForTravelVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);


        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(confirmTravelVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('OK, I\'ve notified bb and t that you\'ll be travelling internationally on the given dates for your card ending in <say-as interpret-as="digits">4782</say-as>. Is there anything else I can do for you today?');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Call the Block Card Function and expect NO Authentication
        var intent = index.intents['intentUnblock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('Is it a credit or debit card');
        expect(response.isSessionEnded).toBe(false);
        console.log('Session Values: ', request.session.values);
        expect(_.isEmpty(request.session.values)).toBe(false);

    });

    it('Test intent Travel with dates but with Valid Pin 1872 and Start again', function () {

        spyOn(request, "slot").and.returnValues('2017-09-01', '2017-10-15', '1872', '4782', '27604');

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentTravelDates']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(welcomeVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);


        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForCardNumberForTravelVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values.isAuth)).toBe(true);


        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(confirmTravelVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('OK, I\'ve notified bb and t that you\'ll be travelling internationally on the given dates for your card ending in <say-as interpret-as="digits">4782</say-as>. Is there anything else I can do for you today?');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Call the Block Card Function and expect NO Authentication
        var intent = index.intents['intentUnblock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('Is it a credit or debit card');
        expect(response.isSessionEnded).toBe(false);
        console.log('Session Values: ', request.session.values);
        expect(_.isEmpty(request.session.values)).toBe(false);

    });


    it('Test intent Travel with dates but with Valid Pin 1872 and Start again - Say Cancel - Expect bb&t pce and exit', function () {

        spyOn(request, 'slot').and.returnValues('2017-09-01', '2017-10-15', '1872', '4782', '27604');

        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentTravelDates']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(welcomeVerbiage);
        expect(response.isSessionEnded).toBeFalsy();
        expect(_.isEmpty(request.session.values)).toBeFalsy();
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeFalsy('ask for pin');
        expect(request.getSession().get(SESSION_KEY).action).toEqual('travel');


        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(askForCardNumberForTravelVerbiage);
        expect(response.isSessionEnded).toBeFalsy();
        expect(_.isEmpty(request.session.values)).toBeFalsy();
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeTruthy('ask for card number');
        expect(request.getSession().get(SESSION_KEY).action).toEqual('travel');


        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBeFalsy();
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeTruthy('ask for zip code');
        expect(_.isEmpty(request.session.values)).toBeFalsy();
        expect(request.getSession().get(SESSION_KEY).action).toEqual('travel');

        // Say the Zipcode tied to the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(confirmTravelVerbiage);
        expect(response.isSessionEnded).toBeFalsy();
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeTruthy('ask for confirmation');
        expect(request.getSession().get(SESSION_KEY).action).toEqual('travel');
        expect(_.isEmpty(request.session.values)).toBeFalsy();

        // Say Cancel
        var intent = index.intents['AMAZON.CancelIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(bbtpceVerbiage);
        expect(response.isSessionEnded).toBeFalsy();
        expect(request.getSession().get(SESSION_KEY).action).toEqual('exit');
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeTruthy('bb&t pce');

        // Say No
        var intent = index.intents['AMAZON.NoIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(signOffVerbiage);
        expect(response.isSessionEnded).toBeTruthy();
        expect(request.getSession().get(SESSION_KEY).action).toEqual('');
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeFalsy();


    });


    it('Test block intent with Credit Card With Valid Pin 1872 and Continue again, expect bb&t pce', function () {

        spyOn(request, "slot").and.returnValues('1872', 'credit', '4782', '27604', 'credit');

        // Start with Launch
        var intent = index.launchFunc;
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(welcomeVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askWhatCanBeDoneTodayVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // 'What\'s the last four digit of the credit card'
        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the last four digit of the credit card');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        // //
        //
        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        //
        // Say the last 4 digits of the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askToConfirmBlockCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        //
        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(blockCreditCardConfirmationVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        //

        // Say Cancel
        var intent = index.intents['AMAZON.CancelIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(bbtpceVerbiage);
        expect(response.isSessionEnded).toBeFalsy('cancel intent');
        expect(request.getSession().get(SESSION_KEY).action).toEqual('exit');
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeTruthy('cancel intent');


    });

    it('Test block intent with Credit Card With Valid Pin 1872 and Continue again, expect bb&t pce', function () {

        spyOn(request, "slot").and.returnValues('1872', 'credit', '4782', '27604', 'credit');

        // Start with Launch
        var intent = index.launchFunc;
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(welcomeVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askWhatCanBeDoneTodayVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        // 'What\'s the last four digit of the credit card'
        // Call the Block Card Function and expect authentication
        var intent = index.intents['intentBlock']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe('What\'s the last four digit of the credit card');
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        // //
        //
        // Call the authentication
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askForZipcodeForCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        //
        // Say the last 4 digits of the card number
        var intent = index.intents['intentWithCardNumberOrZipCodeOrPin']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(askToConfirmBlockCreditCardVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);

        //
        // Say the Zipcode tied to the card number
        var intent = index.intents['AMAZON.YesIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toBe(blockCreditCardConfirmationVerbiage);
        expect(response.isSessionEnded).toBe(false);
        expect(_.isEmpty(request.session.values)).toBe(false);
        //

        // Say No
        var intent = index.intents['AMAZON.NoIntent']['function'];
        intent(request, response);
        expect(request.getSession).toHaveBeenCalled();
        expect(response.text).toEqual(bbtpceVerbiage);
        expect(request.getSession().get(SESSION_KEY).isAuth).toBeFalsy('no intent');
        expect(response.isSessionEnded).toBeTruthy('no intent');
        expect(request.getSession().get(SESSION_KEY).action).toEqual('');



        // // Call the Block Card Function and expect NO Authentication
        // var intent = index.intents['intentUnblock']['function'];
        // intent(request, response);
        // expect(request.getSession).toHaveBeenCalled();
        // expect(response.text).toBe('What\'s the last four digit of the credit card');
        // expect(response.isSessionEnded).toBe(false);
        // console.log('Session Values: ', request.session.values);
        // expect(_.isEmpty(request.session.values)).toBe(false);

    });

});

