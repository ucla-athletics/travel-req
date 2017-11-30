(function() {
	'use strict';

	angular.module('trip.receipts')
	
	.service('ImageSvc', function($q, $log, $cordovaCamera) {
		var self = this;
		//placeholder for current image object during processing
		self.currentImage = {};
		self.takePicture = _takePicture;		

		function _takePicture(useLibrary) {
			//config options for the camera plugin
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
			//local object to hold image data during processing (file url, fileEntry, and file/blob )
			var currentImage = {};

			//use the camera plugin to take a picture or access the photo library and return the file object (blob)		
			return $cordovaCamera.getPicture(options)
			.then(function(imageData) {
				//log and grab the imageData (local file URL) returned from camera or library
				$log.info('cordovaCamera.getPicture: ' + imageData);
				currentImage.imageData = imageData;
				return _getImageFileEntry(imageData);
			}).then(function(fileEntry) {
				//log and grab the fileEntry before sending to cordova.file to get a file stream/blob
				$log.info('File.getFileEntry: ' + fileEntry);
				currentImage.imageFileEntry = fileEntry;
				return _getImageFile(fileEntry);
			}).then(function(file) {
				//log and grab the file object before returing the file stream/blob from function
				$log.info('File.getFile: ' + file);
				currentImage.imageFile = file;
				self.currentImage = currentImage;
		//----->exit point
				return file;
			}).catch(function(error) {
				$log.error('_takePicture error: ' + error);
				return;
			});        
		}

		//wrapper for the cordova file plugin-method to resolve fileEntry
		function _getImageFileEntry(fileUri) {        
			//wrap in $q ctor to convert from callback to promise design and get in angular scope
			return $q(function(resolve, reject) {
				window.resolveLocalFileSystemURI(fileUri,function(fileEntry) {
					resolve(fileEntry);
				}, function(error) {
					reject(error);
				});
			});
		}

		//wrapper for the cordova file plugin-method to resolve file object for saving
		function _getImageFile(fileEntry) {
			//wrap in $q ctor to convert from callback to promise design and get in angular scope
			return $q(function(resolve, reject) {
				fileEntry.file(function(file) {
					resolve(file);
				}, function(error) {
					reject(error);
				});
			});
		}

		return self;
	})
})();