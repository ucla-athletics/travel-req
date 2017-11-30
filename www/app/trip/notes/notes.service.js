(function() {
	'use strict';

	angular.module('trip.notes')

	.service('NotesSvc', function() {
		var self = this;
		self.currentNote = {};
	})

	.factory('Note', function() {
		var Note = function(data) {
			var self = this;
			this.noteDate = new Date();
				this.noteDate.setHours(12,0,0,0);
			this.notes = "";
			if (data) {
				self.notes = data.notes;
				self.noteDate = moment(data.noteDate).toDate();
			}
		}

		return Note;
	});
})();