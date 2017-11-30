(function() {
    'use strict';

    angular.module('app.trips')

    .service('MiscSvc', function(MiscExp) {
        var self = this;
        self.miscExpenses = [];

        self.addMisc = _addMisc;
        self.deleteMisc = _deleteMisc;
        _init();

        function _init() {
        }

        function _addMisc(e) {
        }

        function _deleteMisc(e) {
        }

        return self;
    })

    .factory('MiscExp', function() {
        var MiscExp = function(data) {
            var self = this;
            this.expenseCategory = "Misc";
            this.date = "";
            this.description = "";
            this.amount = "";
            if (data) {
                //text attributes from the JSON data
                self.expenseCategory = data['expenseCategory'];
                self.description = data['description'];
                //numeric attributes from the JSON data
                self.amount = data['amount'];
                //date attributes hydrated as dates from JSON using moment
                self.date = moment(data['date']).toDate();
            }
        }

        MiscExp.prototype.info = function() {
            console.log('MiscExp: ' + this.title);
        }

        return MiscExp;
    });
})();