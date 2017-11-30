(function() {
	'use strict';

	angular.module('trip.receipts')

	.service('ReceiptSvc', function(Pouch) {
		var self = this;
		self.currentReceipt = [];
	})

	.factory('Receipt', function(Pouch) {
		var Receipt = function(data) {
			var self = this;
			this.isNewReceipt = true;
			this.date = moment().toDate();
			this.title = "";
			this.vendor = "";
			this.description = "";
			this.image = "";

			if (data) {
                self.isNewReceipt = false;
				self.title = data.title;
				self.vendor = data.vendor;
				self.description = data.description;
				self.image = data.image;
				//date attributes hydrated as dates from JSON using moment
				self.date = moment(data['date']).toDate();
				//picked up once saved to the pouchdb w/ an attachment
				self.attachId = data['attachId'];
			}
		}

		Receipt.prototype.getImageUrl = function(t) {
			var self = this;
			console.info('getAttachemnt: ' + t._id + ', ' + self.attachId);
			return Pouch.db.getAttachment(t.receiptDocId, self.attachId)
				.then(function(imgBlob) {
					self.imageUrl = URL.createObjectURL(imgBlob);
					return self.imageUrl;
				}).catch(function(err) {
					console.error('Receipt_getImageUrl: ' + err);
					return;
				});        
		}

		return Receipt;
	});
})();