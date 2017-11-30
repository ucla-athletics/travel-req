(function() {
    'use strict';

    angular.module('app.trips')

    .factory('TransportationExp', function() {
        var TransportationExp = function(data) {
            var self = this;
            this.expenseCategory = "Transportation";
            this.date = new Date();
            this.company = "";
            this.amount = "";
            if (data) {
                //text attributes from the JSON data
                self.expenseCategory = data['expenseCategory'];
                self.company = data['company'];
                //numeric attributes from the JSON data
                self.amount = data['amount'];
                //date attributes hydrated as dates from JSON using moment
                self.date = moment(data['date']).toDate();
            }
        }

        TransportationExp.prototype.info = function() {
            console.log('TransportationExp: ' + this.company);
        }

        return TransportationExp;
    });
})();