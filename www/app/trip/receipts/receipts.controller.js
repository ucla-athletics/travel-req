(function() {
	'use strict';

	var ctrl = 'ReceiptsCtrl';
	angular.module('trip.receipts')

	.controller(ctrl, function($scope, $q, $state, $timeout, $ionicActionSheet, $cordovaCamera, $cordovaFile
										  , logger
										  , TripSvc, ImageSvc, ReceiptSvc, ReportSvc, EmailSvc, Receipt, Pouch) {
		$scope.addReceiptSheet = _addReceiptSheet;  
		$scope.deleteReceipt = _deleteReceipt;
		$scope.selectImage = _selectImage;
		$scope.takePicture = _takePicture;
//		$scope.sendTrip = _sendTrip;
		$scope.tripSvc = TripSvc;
		$scope.imageSvc = ImageSvc;
		$scope.docFolder = (!window.cordova)?'':cordova.file.documentsDirectory;

		$scope.$on('$ionicView.enter', function(event, data) {
			logger.info(ctrl + '_enter');
			_init();
		});	
		$scope.$on('$ionicView.leave', function(event, data) {
			logger.info(ctrl + '_leave');
		});

		function _init() {  
	//    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
	//    $scope.$on('$ionicView.enter', function() {
	//        if (toState.name == 'app.single.receipts') {
			console.log('Enter Receipts Ctrl...');
			console.info('cordova.docsDir: ' + $scope.docFolder);
			$cordovaFile.checkDir($scope.docFolder, '')
			.then(function(success) {
				console.info('checkDir: ' + success.toURL());
			})
			if (TripSvc.currentTrip.receipts && TripSvc.currentTrip.receipts.length > 0) {
				console.info('image dir: ' + TripSvc.currentTrip.receipts[0].image);
			}

			var chain = $q.when();
			TripSvc.currentTrip.receipts.forEach(function(r) {
				chain = chain.then(_getImageUrl(TripSvc.currentTrip, r));
			})
			//run a final ansyc call to the attachment doc to get the current _rev number
			return chain.then(function() {
				return TripSvc.currentTrip.syncReceiptRev();
			}).then(function() {
				console.log('receipts downloaded');
			}).catch(function(err) {
				console.error(err);
			});
		}
	//    });

		function _getImageUrl(trip, item) {
			if (!cordova) return null;
			return function() {
				return item.getImageUrl(trip);  
			};
		}

		function _addReceiptSheet() {
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '<b>Take New Photo</b>' },
					{ text: 'Exisiting Photo' }
				],
				titleText: 'Add Receipt',
				cancelText: 'Cancel',
				cancelFunc: function() {
				},
				buttonClicked: function(index) {
					hideSheet();
					_takePicture(index);
					return true;
				}
			});
			//safety net timeout call to hide the action sheet if no input after 3sec
			$timeout(function() {
				hideSheet();
			}, 3000);
		}

		function _deleteReceipt(r) {
			TripSvc.currentTrip.deleteReceipt(r);
			//TripSvc.pause();
		}

		function _selectImage(r) {
			ReceiptSvc.currentReceipt = r;
			ImageSvc.currentImage = r.image;        
	//        ImageSvc.currentImage = ImageSvc.images[$index];
			$state.go('app.image');
		}

		function _takePicture(useLibrary) {
			ImageSvc.takePicture(useLibrary)
			.then(function(file) {
                if (file) {
                    var r = new Receipt();
                    r.trip_id = TripSvc.currentTrip._id;
                    r.attachmentId = file.name;
                    r.imageUrl = ImageSvc.currentImage.imageData;

                    //ImageSvc.currentImage.imageData = file;
                    ReceiptSvc.currentReceipt = r;            
                    //navigate to the receipt viewer at the 'app.image' route
                    $state.go('app.image');            
                }
			}).catch(function(err) {
				console.error(err);
			});
		}

		function _takePictureOLD(useLibrary) {
			var options = {
			  quality: 80,
			  destinationType: Camera.DestinationType.FILE_URI,
			  sourceType: (useLibrary==0)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY,
			  allowEdit: false,
			  encodingType: Camera.EncodingType.JPEG,
			  targetWidth: 850,
			  targetHeight: 1100,
			  saveToPhotoAlbum: false
			};
			var outputFile = "";
			var imgData = "";
			var blob;
			var imageId;
			var imageFile = "";

			$cordovaFile.checkDir(cordova.file.documentsDirectory, '')
			.then(function(success) {
				console.log('checkDir directory found: ' + cordova.file.documentsDirectory);
				//create a reader and list direcotry contents
				return getMaxFilename(success);
			}).then(function(maxfile) {
				//pass the maxfile to the routine to increment maxfilename
				return incrementMaxFilename(maxfile);
			}).then(function(newFilename) {
				outputFile = newFilename;
				//now that a suitable filename is available, kickoff the picture takings (camera or library)
				return $cordovaCamera.getPicture(options);
			}).then(function(imageData) {
				//placeholder for now to allow passing thru the promise chain...
				imgData = imageData;
				return _getImageFileEntry(imageData)
				.then(function(fileEntry) {
					return _getImageFile(fileEntry);
				}).then(function(file) {
					console.info('Receipt Image Taken');
					console.log('filename: ' + file.name);
					imageId = 'rcpt_' + moment().format('YYYYMMDD.hhmmss.SSS');
					imageFile = file.name;

					console.info('putAttachemnt: ' + TripSvc.currentTrip._id + ', ' + imageFile);
					return Pouch.db.putAttachment(TripSvc.currentTrip._id, imageFile, TripSvc.currentTrip._rev, file, 'image/jpeg');
				});
			}).then(function(result) {
				console.info('putAttachment result: ' + result);
				TripSvc.currentTrip._rev = result.rev;
				return Pouch.db.getAttachment(TripSvc.currentTrip._id, imageFile).then(function(imgBlob) {
					blob = imgBlob;
				});
	//        }).then(function() {
	//            //links up back to the initial response from getPic...
	//            return movePhoto(imgData, outputFile);
	//                


			}).then(function() {
				return Pouch.db.get(TripSvc.currentTrip._id, {attachments:true, revs_info:true}).then(function(result) {
					console.log(result);
					return;
				});

			}).then(function(result) {
	//            console.log('image moved: ' + success);
				//update the receipt object, and persist to tripSvc, receiptSvc, and imgSvc
				var r = new Receipt();
				r.image = ImageSvc.currentImage.imageFile.name;
				r.trip_id = TripSvc.currentTrip._id;
				r.attachmentId = ImageSvc.currentImage.imageId;
				r.imageId = ImageSvc.currentImage.imageId;
				r.imageUrl = ImageSvc.currentImage.imageData;

	//            TripSvc.currentTrip.addReceipt(r);
				ReceiptSvc.currentReceipt = r;
				//navigate to the receipt viewer at the 'app.image' route
					$state.go('app.image');
			}).catch(function(err){
				console.error('There was a problem taking a picture!');
			});
	//        var options = {
	//          quality: 80,
	//          destinationType: Camera.DestinationType.FILE_URI,
	//          sourceType: (useLibrary==0)?Camera.PictureSourceType.CAMERA:Camera.PictureSourceType.PHOTOLIBRARY,
	//          allowEdit: false,
	//          encodingType: Camera.EncodingType.JPEG,
	//          targetWidth: 850,
	//          targetHeight: 1100,
	//          saveToPhotoAlbum: false
	//        };
	//        var outputFile = "";
	//        var imgData = "";
	//        var blob;
	//        var imageId;
	//        var imageFile = "";
	//        
	//        $cordovaFile.checkDir(cordova.file.documentsDirectory, '')
	//        .then(function(success) {
	//            console.log('checkDir directory found: ' + cordova.file.documentsDirectory);
	//            //create a reader and list direcotry contents
	//            return getMaxFilename(success);
	//        }).then(function(maxfile) {
	//            //pass the maxfile to the routine to increment maxfilename
	//            return incrementMaxFilename(maxfile);
	//        }).then(function(newFilename) {
	//            outputFile = newFilename;
	//            //now that a suitable filename is available, kickoff the picture takings (camera or library)
	//            return $cordovaCamera.getPicture(options);
	//        }).then(function(imageData) {
	//            //placeholder for now to allow passing thru the promise chain...
	//            imgData = imageData;
	//            return _getImageFileEntry(imageData)
	//            .then(function(fileEntry) {
	//                return _getImageFile(fileEntry);
	//            }).then(function(file) {
	//                console.info('Receipt Image Taken');
	//                console.log('filename: ' + file.name);
	//                imageId = 'rcpt_' + moment().format('YYYYMMDD.hhmmss.SSS');
	//                imageFile = file.name;
	//                
	//                console.info('putAttachemnt: ' + TripSvc.currentTrip._id + ', ' + imageFile);
	//                return Pouch.db.putAttachment(TripSvc.currentTrip._id, imageFile, TripSvc.currentTrip._rev, file, 'image/jpeg');
	//            });
	//        }).then(function(result) {
	//            console.info('putAttachment result: ' + result);
	//            TripSvc.currentTrip._rev = result.rev;
	//            return Pouch.db.getAttachment(TripSvc.currentTrip._id, imageFile).then(function(imgBlob) {
	//                blob = imgBlob;
	//            });
	////        }).then(function() {
	////            //links up back to the initial response from getPic...
	////            return movePhoto(imgData, outputFile);
	////                
	//        }).then(function() {
	//            return Pouch.db.get(TripSvc.currentTrip._id, {attachments:true, revs_info:true}).then(function(result) {
	//                console.log(result);
	//                return;
	//            });
	//        }).then(function(result) {
	////            console.log('image moved: ' + success);
	//            //update the receipt object, and persist to tripSvc, receiptSvc, and imgSvc
	//            var r = new Receipt();
	////            r.image = success.name;
	//            r.trip_id = TripSvc.currentTrip._id;
	//            r.attachmentId = imageFile;
	//            r.imageUrl = URL.createObjectURL(blob);
	//            
	//            TripSvc.currentTrip.addReceipt(r);
	//            ReceiptSvc.currentReceipt = r;
	////            ImageSvc.currentImage = r.image;
	////            TripSvc.pause();
	//            //navigate to the receipt viewer at the 'app.image' route
	//            $state.go('app.image');            
	//        })
	//        .catch(function(error) {
	//            console.error('_takePicture error: ' + error);
	//        });        
		}

		function _getImageFileEntry(fileUri) {        
			return $q(function(resolve, reject) {
				window.resolveLocalFileSystemURI(fileUri,function(fileEntry) {
					resolve(fileEntry);
				}, function(error) {
					reject(error);
				});
			});
		}
		function _getImageFile(fileEntry) {        
			return $q(function(resolve, reject) {
				fileEntry.file(function(file) {
					resolve(file);
				}, function(error) {
					reject(error);
				});
			});
		}

		function getMaxFilename(dirEntry) {
			//create a reader and list direcotry contents
			console.log('create dir reader: ' + dirEntry.fullPath);
			var defer = $q.defer();
			var rdr = dirEntry.createReader();
			//execute reader and wrap in an angular promise        
			rdr.readEntries(function(entries) {
				if (entries) {
					console.log('directory count: ' + entries.length);
					//filter the entry list to only files and eliminate sysFiles and dotfiles
					var files = _.filter(entries, function(e) {
						return e.isFile && e.name.substring(0,3) == 'cdv'; 
					});
					console.log('filtered files: ' + files.length);
					if (files.length == 0) {
						//first time, so init the filename to get started...
						defer.resolve('cdv_photo_000.jpg');
					} else {
						// sort and grab the max file to use for incrementing
						var maxFile = _.chain(files).sortBy('name').last().value();
						console.log('max file: ' + maxFile.name);
						defer.resolve(maxFile.name);                    
					}
				}
			}, function(error) {
				defer.reject(error);
			});
			return defer.promise;
			//did not place catch clause here because not sure how to handle here...
			// but I think it should bubble up to be processed higher up in the chain
		}

		function incrementMaxFilename(filename) {
			//filename parts and the xtension parts on '_' and '.' respectively
			var nameParts = filename.split('_');
			var extensionParts = nameParts[2].split('.');
			//parse, increment and reinsert the updated file index
			var number = parseInt(extensionParts[0]) + 1;
			var index = '000' + number.toString();
			index = index.substring(index.length-3);            
			extensionParts[0] = index;
			//rejoin the extension parts, and then rejoin the filename parts
			nameParts[2] = extensionParts.join('.');            
			var newFilename = nameParts.join('_');

			return newFilename;        
		}

		function movePhoto(file, newFilename){
			var origFilename = file.replace(/^.*[\\\/]/, '');

			return $cordovaFile.moveFile(cordova.file.tempDirectory, origFilename
										 , cordova.file.documentsDirectory, newFilename)
			.then(function (success) {
				// success
				console.log('successfully moved');
				return success;
			})
			.catch(function (error) {
				// error
				console.log('error moving: ' + error);
			});
		}    
	});	
})();