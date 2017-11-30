(function() {
	'use strict';

	var ctrl = 'NotesCtrl';
	angular.module('trip.notes')
	
	.controller(ctrl, function($scope, logger, $ionicModal, $cordovaDatePicker
									   , TripSvc, NotesSvc, Note) {
		$scope.vm = {};
		$scope.tripSvc = TripSvc;
		$scope.noteSvc = NotesSvc;

		$scope.saveNote = _saveNote;
		$scope.closeModal = _closeModal;
		$scope.editNote = _editNote;
		$scope.addNote = _addNote;
		$scope.deleteNote = _deleteNote;

		$scope.newNote = null;

		$scope.$on('$ionicView.enter', function(event, data) {
			logger.info(ctrl + '_enter');
		});	
		$scope.$on('$ionicView.leave', function(event, data) {
			logger.info(ctrl + '_leave');
		});

		$scope.$on('modal.shown', function() {
			logger.log('NotesCtrl Controller... ');
			if (!$scope.newNote) {
				//init a new Note() when adding a new travel note
				$scope.newNote = new Note();
			} else {
				//grab reference to the original Note and make a copy to work on
				$scope.original = $scope.newNote;
				$scope.newNote = angular.copy($scope.original);
			}
		});

		function _saveNote() {
			//dirty check the noteForm before trying to save the TravelNote
			var isDirty = $scope.vm.noteForm.$dirty;
			if (isDirty) {
				//check for new addTravelNote, or existing updateTravelNote
				if ($scope.isNewTravelNote) {
					logger.log('NotesCtrl: save new travel note');
					TripSvc.currentTrip.addNote($scope.newNote);
				} else {
					//lookup the original TravelDate in the trips travelDates[]
					var index = TripSvc.currentTrip.notes.indexOf($scope.original);
					if (index > -1) {
						logger.log('NotesCtrl: save updated travel note');
						//replace the original travelDates w/ newTravelDate
						TripSvc.currentTrip.notes[index] = $scope.newNote;
					}
				}
				//save the record before closing
				TripSvc.currentTrip.save();
				$scope.isNewTravelNote = false;
			}
			$scope.modal.hide();			
		};

		function _addNote() {
			var n = new Note();
			$scope.isNewTravelNote = true;
			//TripSvc.currentTrip.addNote(n);
			_editNote(n);
		}

		function _editNote(n) {
			$scope.newNote = n;
			_loadNotesModal();
		}

		function _deleteNote(n) {
			TripSvc.currentTrip.deleteNote(n);
		}

		function _closeModal() {
			$scope.modal.hide();
		}

		function _loadNotesModal() {
			$ionicModal.fromTemplateUrl('app/trip/notes/note.modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				modal.show();
			});
		}
	});
})();