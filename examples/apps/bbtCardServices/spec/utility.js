
var prompts =


module.exports = {
    applyTemplate: function(step, messageKey, cardServicesSession) {
        return _.template(prompts[step][messageKey])({
            action: cardServicesSession.action || '',
            cardType: cardServicesSession.cardType || '',
            cardNumber: cardServicesSession.cardNumber || '',
            zipCode: cardServicesSession.zipCode || '',
            fromDate: cardServicesSession.fromDate || '',
            toDate: cardServicesSession.toDate || ''
        });

    }
}

function applyTemplate() {

}
