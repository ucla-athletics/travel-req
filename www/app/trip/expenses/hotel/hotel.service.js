(function() {
    'use strict';

    angular.module('app.trips')

    .service('HotelSvc', function(AirfareExp) {
        var self = this;
        self.hotelExpenses = [];

        self.addHotel = _addHotel;
        self.deleteHotel = _deleteHotel;

        function _addHotel(e) {
            console.log('HotelSvc::addHotel - ' + e.date + e.hotelName);
            self.hotelExpenses.push(e);
        }

        function _deleteHotel(e) {
            console.log('HotelSvc::deleteHotel - ' + e.date + e.hotelName);
            var index = self.hotelExpenses.indexOf(e);
            if (index >-1) {
                self.hotelExpenses.splice(index,1);
            } else {
                console.log('hotel not found in tripSvc');
            }
        }

        return self;
    })

    .factory('HotelExp', function() {
        var HotelExp = function(data) {
            var self = this;
            this.expenseCategory = "Hotel";
            this.date = "";
            this.hotelName = "";
            this.amount = "";
            this.notes = "";
            if (data) {
                //text attributes from the JSON data
                self.expenseCategory = data['expenseCategory'];
                self.hotelName = data['hotelName'];
                self.notes = data['notes'];            
                //numeric attributes from the JSON data
                self.amount = data['amount'];
                //date attributes hydrated as dates from JSON using moment
                self.date = moment(data['date']).toDate();
            }
        }

        HotelExp.prototype.info = function() {
            console.log('HotelExp: ' + this.title);
        }

        return HotelExp;
    });
})();