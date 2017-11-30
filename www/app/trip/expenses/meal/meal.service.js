(function() {
    'use strict';

    angular.module('app.trips')

    .service('MealSvc', function(MealExp) {
        var self = this;
        self.mealExpenses = [];

        self.addMeal = _addMeal;
        self.deleteMeal = _deleteMeal;
        _init();

        function _init() {
        }

        function _addMeal(e) {
        }

        function _deleteMeal(e) {
        }

        return self;
    })

    .factory('MealExp', function() {
        var MealExp = function(data) {
            var self = this;
            this.expenseCategory = "Meal";
            this.date = "";
            this.guestNames = "";
            this.restaurant = "";
            this.amount = "";
            this.isStudentAllowance = false;
            if (data) {
                //text attributes from the JSON data
                self.expenseCategory = data['expenseCategory'];
                self.guestNames = data['guestNames'];
                self.restaurant = data['restaurant'];
                //numeric attributes from the JSON data
                self.amount = data['amount'];
                //boolean values
                self.isStudentAllowance = data['isStudentAllowance'];
                //date attributes hydrated as dates from JSON using moment
                self.date = moment(data['date']).toDate();
            }
        }

        MealExp.prototype.info = function() {
            console.log('MealExp: ' + this.title);
        }

        return MealExp;
    });
})();