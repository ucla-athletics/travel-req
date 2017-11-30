angular.module('app.trips')

.service('TripSvc', function($q, $log, $rootScope, Trip, Pouch) {
    var self = this;    
    self.trips = [];
    self.currentTrip = {};
    self.addTrip = _addTrip;
    self.saveTrip = _saveTrip;
    self.deleteTrip = _deleteTrip;
    self.resume = _resume;
    self.pause = _pause;
    
    function _addTrip(t) {
        $log.log('TripSvc::addTrip - ' + t.title);
        if (t.id == -1) t.id = self.trips.length;
        t._id = moment().format('YYYYMMDD.hhmmss.SSS');
        Pouch.db.put(t).then(function(result) {
            self.trips.push(t);
            $log.log(result);
        }).catch(function(err) {
            $log.log(err);
        });
    }
    
    function _deleteTrip(t) {
        $log.log('TripSvc::deleteTrip - ' + t.title);
        Pouch.db.remove(t._id, t._rev);
        var index = self.trips.indexOf(t);
        if (index >-1) {
            self.trips.splice(index,1);
        } else {
            $log.log('trip not found in tripSvc');
        }
    }	
	
    //calls --> _hydrateFromPouch
	function _migrateResume() {
        _hydrateFromPouch();
//		//check for localStorage in the 'trips' key
//		var isLocal = !!localStorage['trips'];
//        //check for the pouch serve and db object
//        var isPouch = (Pouch && Pouch.db);
//		
//        
//        $q.when( isPouch ).then( function(isPouch) {
//            if (isPouch) {
//                return Pouch.db.info();
//            } else return;
//        }).then(function(info) {
//
//            if (isLocal) {
//                if (info && info.update_seq == 0) {
//            //Case1: localStorage and a NEW pouchdb
//                    _hydrateFromLocal();
//                    //pause to store in pouchDB and start migration
//                    _pause();                    
//                } else if (info && info.update_seq !== 0) {
//            //Case2: localStorage and a data in pouchdb
//                    //clear the local store to complete the migration
//                    localStorage.removeItem('trips');
//                    _hydrateFromPouch();
//                } else {
//            //Case3: no pouchdb so carry on w/ localStorage
//                    _hydrateFromLocal();
//                }                
//            } else {
//                if (isPouch) {
//                    _hydrateFromPouch();
//                } else {
//                    throw new Error('There is no localStorage and no PouchDB for trips.');
//                }                
//            }
//        });
	}
	
    function _hydrateFromLocal() {
        if (localStorage['trips']) {
            //parse the localStorage for trips and then extend the current service to overwrite data
            var serviceData = JSON.parse(localStorage['trips']);
            //angular.extend(self, settings);
            return _hydrate(serviceData);
        } else { 
            throw new Error('hydrateFromLocal: There is no localStorage of trips.');
        }
    }
    
    //get allDocs and hydrate from results
    function _hydrateFromPouch() {
        return Pouch.db.allDocs({include_docs:true, attachments:true})
            .then(function(result) {
                return _hydrate(result);
            }).catch(function(err) {
                $log.error(err);
            });
    }
    
    //calls --> _migrateResume
    function _resume() {
//        if (Pouch && Pouch.db) {
//			if (localStorage['trips']) {
//				//parse the localStorage for trips and then extend the current service to overwrite data
//				var serviceData = JSON.parse(localStorage['trips']);
//
//			}
//			Pouch.db.info().then(function(info) {
//				if (info.update_seq === 0) {
//					_pause();
//				} else {
//					localStorage.removeItem('trips');
//				}
//			});
//
//			return Pouch.db.allDocs({include_docs:true}).then(function(result) {
//                _hydrate(result);
//            }).catch(function(err) {
//                $log.error(err);
//            });
//        }
        _migrateResume();

        
//        if (localStorage['trips']) {
//            //parse the localStorage for trips and then extend the current service to overwrite data
//            var serviceData = JSON.parse(localStorage['trips']);
//            //angular.extend(self, settings);
//            _hydrate(serviceData);
//        }
    }
    
    function _hydrate(data) {
        //check for an array of trips in the json data provided
        if (data) {
            var trips = data.trips?data.trips:data.rows;
            //reset the internal array of trips in the service, then loop each trip
            self.trips.length = 0;
            trips.forEach(function(tripData) {
                //pass the trip JSON to the constrcutor of the Trip class
                if (tripData.doc.hasOwnProperty('traveler')) {
                    //instantiate a Trip obj from the json doc
                    var trip = new Trip(tripData.doc);
                    
                    //and add the trip to the collection in the service
                    self.trips.push(trip);
                    $log.info('Trip hydrated: ' + trip._id);
                    return true;
                } else { 
                    $log.info('This is not a trip doc: ' + tripData.doc._id); 
                    return false;
                }
            });
            $rootScope.$broadcast('TripSvc::ready');
        } { return false;}
    }
    
    function _saveTrip(t) {
        $log.info('TripSvc_saveTrip BEGIN: ' + t._rev);
        return Pouch.db.put(t).then(function(result) {
			$log.info('TripSvc_saveTrip END: ' + result.rev);
            t._rev = result.rev;
            return result.rev;
        });
    }    
    
    function _pause() {
//        //stringify and stuff in localStorage
//        var settings = JSON.stringify(self);
//        localStorage['trips'] = settings;
        
//        self.trips.forEach(function(trip) {
//            Pouch.db.put(trip._id, trip._rev)
//        })

        
        
//        var chain = $q.when();
//        self.trips.forEach(function(t) {
//            chain = chain.then(_saveTrip(t));
//        })
//        
//        return chain.then(function() {
//            $log.log('trips saved to database');
//        });
//        self.trips.forEach(function(t) {
//            t.receipts.forEach(function(r) {
//                delete r.imageUrl;
//            });
//        });
        
//        return Pouch.db.bulkDocs(self.trips).then(function(result) {
//            $log.info('tripService.pause()');
//            return;
//        }).catch(function(err) {
//            $log.error('ERR: tripService.pause()');
//            return;
//        });
    }
    
    return self;
})

.factory('Trip', function($log, AirfareExp, HotelExp, TransportationExp, MileageExp, MealExp
                           , MiscExp, TravelDate, Receipt, Note, Pouch) {
    var Trip = function(data) {
        var self = this;
        //check the data param to check for a JSON object
        var isDataObject = (typeof data === "object") && (data !== null);
        
        this.id = -1;
		this._id = moment().format('YYYYMMDD.hhmmss.SSS');
        //if data is not JSON, it is the string for the title
        this.title = (!!data && !isDataObject)?data:"";
        this.purpose = "";
        
        this.traveler = "";
        this.travelerEmail = "";
        this.travelerDepartment = "";
        this.destinations = "";
        this.homeCity = "";
        this.vehicleUsed = "";
        this.statDate = new Date();
        this.endDate = new Date() + 1;
        this.travelDates = [];
        this.expenses = [];

        this.receiptDocId = 'rcpts_' + this._id;
        this.receiptRev = '0-0';
        this.receiptIndex = 0;
        this.receipts = [];

		this.notes = [];
        this.isSubmitted = false;
        //if data is JSON, then use extend to copy in all the values
        if (data && isDataObject) {
            self._id = data._id;
            self._rev = data._rev;
            //this needs to be improved to do a deeper copy so expenses are objects w/ class methods
            //angular.extend(self, data);
            self.traveler = data['traveler'];
            self.travelerEmail = data['travelerEmail'];
            self.travelerDepartment = data['travelerDepartment'];
            self.title = data['title'];
            self.purpose = data['purpose'];
            self.destinations = data['destinations'];
            self.homeCity = data['homeCity'];
            self.vehicleUsed = data['vehicleUsed'];
            self.startDate = moment(data['startDate']).toDate();
            self.endDate = moment(data['endDate']).toDate();
            self.receiptIndex = data['receiptIndex'];
            self.receiptDocId = data['receiptDocId'];
            self.receiptRev = data['receiptRev'];
            self.isSubmitted = data['isSubmitted'];
            if (data.expenses && data.expenses.length > 0) {
                var expenses = data.expenses;
                self.expenses = [];
                expenses.forEach(function(expenseData) {
                    if (expenseData['expenseCategory'] === 'Airfare') {
                        var expense = new AirfareExp(expenseData);
                    }
                    else if(expenseData['expenseCategory'] === 'Hotel') {
                        var expense = new HotelExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Transportation') {
                        var expense = new TransportationExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Mileage') {
                        var expense = new MileageExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Meal') {
                        var expense = new MealExp(expenseData);                        
                    }
                    else if(expenseData['expenseCategory'] === 'Misc') {
                        var expense = new MiscExp(expenseData);                        
                    }
                    self.addExpense(expense);
                })
            }
            if (data.travelDates && data.travelDates.length > 0) {
                var dates = data.travelDates;
                self.travelDates = [];
                dates.forEach(function(d) {
                    var travelDate = new TravelDate(d);
                    self.addTravelDate(travelDate);
                })
            }
            if (data.receipts && data.receipts.length > 0) {
                var receipts = data.receipts;
                self.receipts = [];
                receipts.forEach(function(r) {
                    var rcpt = new Receipt(r);
//                    self.addReceipt(rcpt);
					self.receipts.push(rcpt);
                })
            }
            if (data.notes && data.notes.length > 0) {
                var notes = data.notes;
                self.notes = [];
                notes.forEach(function(n) {
                    var note = new Note(n);
                    self.addNote(note);
                })
            }
        }
    }
	Trip.prototype.save = _save;
    Trip.prototype.addExpense = _addExpense;
    Trip.prototype.deleteExpense = _deleteExpense;
    Trip.prototype.addTravelDate = _addTravelDate;
    Trip.prototype.deleteTravelDate = _deleteTravelDate;
    Trip.prototype.addReceipt = _addReceipt;
    Trip.prototype.deleteReceipt = _deleteReceipt;
    Trip.prototype.syncReceiptRev = _syncReceiptRev;
    Trip.prototype.addNote = _addNote;
    Trip.prototype.deleteNote = _deleteNote;
    Trip.prototype.totalExpenses = _totalExpenses;
    
    Trip.prototype.info = function() {
        $log.log('Title: ' + this.title);
    }
    
	function _save() {
        var self = this;
		return Pouch.db.put(self).then(function(result) {
			$log.info('Trip.saved: ' + self._rev + ' --> ' + result);
            self._rev = result.rev;
		});
	}
	
    function _addExpense(e) {
        this.expenses.push(e);
    }
    
    function _deleteExpense(e) {
        $log.log('Trip::deleteExpense - ' + e);
        var index = this.expenses.indexOf(e);
        if (index >-1) {
            this.expenses.splice(index,1);
            //added to make sure trip is persisted after update from delete
            this.save();
        } else {
            $log.log('expense not found in trip object');
        }
    };
    
    function _totalExpenses() {
        var sum = 0;
        if (this.expenses && (this.expenses.length > 0)) {
            this.expenses.forEach(function(exp) {
                if (exp.amount) sum += exp.amount;
            })
        }
        return sum.toFixed(2);
    }
	
	function _addTravelDate(d) {
		this.travelDates.push(d);
	}
    
    function _deleteTravelDate(d) {
        $log.log('Trip::deleteTravelDate - ' + d);
        var index = this.travelDates.indexOf(d);
        if (index >-1) {
            this.travelDates.splice(index,1);
            //added to make sure trip is persisted after update from delete
            this.save();
        } else {
            $log.log('travelDate not found in trip object');
        }
    };

	function _addReceipt(r, file) {
		var self = this;
		r.attachId = 'receipt_' + (++self.receiptIndex) + '.jpg';
		var receiptResult = {};
        //start by saving the image file as an attachment using call to set context
		return _saveAttachment.call( self, r.attachId, file )
			.then(function(result){
                //on success, increment the index, update the trip doc revision
				self.receiptIndex++;
				self.receiptRev = result.receiptRev;
                //then add the receipt to the receipts [] and save the trip doc
				self.receipts.push(r);
				receiptResult.imageUrl = result.imageUrl;
				return Pouch.db.put(self);
			}).then(function(result) {
                //update the trip doc to use the new rev after saving w/ new receipt
				self._rev = result.rev;
                self.isNewReceipt = false;
				return receiptResult.imageUrl; 
			}).catch(function(err) {
                //rollback the receiptIndex if there is a problem
				self.receiptIndex--;
				$log.error(err);
			});
	}
        
	function _saveAttachment(attachId, file) {
		//grab the docId for receipt master doc from this trip object
		var docId = this.receiptDocId;
		//setup the latest document revision nunmber if not new
		var attachmentResult = {};
		var rev = (this.receiptRev!=="0-0")?this.receiptRev:undefined;
		//put the image file in the receipt master doc
		return Pouch.db.putAttachment(docId, attachId, rev, file, 'image/jpeg')
			.then(function (result) {
				//log the result and update the trip to hold the latest revision for the master doc
				$log.log(result);
				attachmentResult.receiptRev = result.rev;
				//then, grab the image file blob using getAttachment
				return Pouch.db.getAttachment(docId, attachId);
			}).then(function(blob) {
				if (blob) {
                    //convert the blob to an object URL and attach to function result
					attachmentResult.imageUrl = URL.createObjectURL(blob);
					return attachmentResult;
				} else { throw new Error('The attachment did not return a blob during save.'); }
			}).catch(function (err) {
				$log.error(err);
			});            
	}
    
    function _deleteReceipt(r) {
        $log.log('Trip::deleteReceipt - ' + r);
        var self = this;
        var index = self.receipts.indexOf(r);
        if (index >-1) {
			_deleteAttachment(self.receiptDocId, r.attachId, self.receiptRev)
                .then(function(rev) {
                    self.receiptRev = rev;
                    self.receipts.splice(index,1);
                    //added to make sure trip is persisted after update from delete
                    self.save();
			});
        } else {
            $log.log('receipt not found in trip object');
        }
    }
	
	function _deleteAttachment(docId, attachId, rev) {
		return Pouch.db.removeAttachment(docId, attachId, rev)
			.then(function(result) {
				return result.rev;
			}).catch(function(err) {			
				$log.error(err);
			});
	}

	function _addNote(n) {
		this.notes.push(n);
	}
    
    function _deleteNote(n) {
        $log.log('Trip::deleteNote - ' + n);
        var self = this;
        var index = self.notes.indexOf(n);
        if (index >-1) {
            self.notes.splice(index,1);
            //added to make sure trip is persisted after update from delete
            self.save();
        } else {
            $log.log('note not found in trip object');
        }
    };
    
    function _syncReceiptRev() {
        var self = this;
        return Pouch.db.get(self.receiptDocId).then(function(result) {
            self.receiptRev = result._rev;
        }).catch(function(err) {
            $log.error(err);
        });
    }

    return Trip;
})

.factory('TravelDate', function() {
    var TravelDate = function(data) {
        var self = this;
        this.travelDate = new Date();
            this.travelDate.setHours(12,0,0,0);
        this.departTime = new Date();
            this.departTime.setHours(8,0,0,0);
        this.returnTime = new Date();
            this.returnTime.setHours(17,0,0,0);
        this.isBreakfast = false;
        this.isLunch = false;
        this.isDinner = false;
        if (data) {
            //boolean attributes from the JSON data
            self.isBreakfast = data['isBreakfast'];
            self.isLunch = data['isLunch'];
            self.isDinner = data['isDinner'];
            //date attributes hydrated as dates from JSON using moment
            self.travelDate = moment(data['travelDate']).toDate();
            self.departTime = moment(data['departTime']).toDate();
            self.returnTime = moment(data['returnTime']).toDate();
        }
    }

    return TravelDate;
});