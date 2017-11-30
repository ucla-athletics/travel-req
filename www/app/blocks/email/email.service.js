angular.module('blocks.email')

.service('EmailSvc', function($q, $fileLogger, $cordovaEmailComposer, Pouch) {
    var self = this;    
    self.sendEmail = _sendEmail; 
    self.sendLogfile = _sendLogfile;
    
    function _sendEmail(t, file) {
		return $cordovaEmailComposer.isAvailable().then(function() {
            var subj = t.title;
            subj += ": " + moment(t.startDate).format("M-D-YY");
            subj += (t.endDate)?" - " + moment(t.endDate).format("M-D-YY"):"";

            var b = 'Attached is a reimbursement report and associated receipt images.  Trip details are summarized in the pdf file.  All supporting receipt documentation is attached as a separate image file for each receipt.\n\n';
            b += "Purpose: " + t.purpose;
            
            var attachments = [ file ];
//            attachments = attachments.concat(_receiptArray(t));
//            var attachments = [];
            return _receiptArray(t).then(function(imageArray) {
                attachments = attachments.concat(imageArray);
                return attachments;
            }).then(function(attachments) {
                var email = {
                    to: 'expensereport@athletics.ucla.edu', 
                    cc: 'akitagawa@athletics.ucla.edu',
                    subject: subj,
                    body: b, 
                    attachments: attachments
                };

                return $cordovaEmailComposer.open(email);
                
            }).catch(function(e) {
                if (typeof(e) == 'undefined') {
                    return $q.resolve();
                } else {
                    console.error('problem in the email service for _sendEmail()');
                    return $q.reject(e);                    
                }
            });            

		}).catch(function (error) {
		   // not available
			console.log('trouble with the email composer availability.');
            return $q.reject(error);
		});
	}
    
    function _sendLogfile() {
        return $fileLogger.checkFile().then(function(data) {
            window.resolveLocalFileSystemURI(data.localURL, function(fileEntry) {
                console.log(fileEntry.toURL());
                var email = {
                    to: 'jleininger@athletics.ucla.edu',
                    subject: 'LOGFILE: reimbursement logfile',
                    body: JSON.stringify(data),
                    attachments: fileEntry.toURL()
                };
                return $cordovaEmailComposer.open(email);
            });        
        }).catch(function(e) {
            return $q.reject(e);
        });
    }
    
    function _receiptArray(t) {
        var images = [];
        var chain = $q.when();
        if (t && t.receipts) {
            t.receipts.forEach(function(r) {
                chain = chain.then(function() {
                    return _getAttachmentBlob(r, t);
                }).then(function(blob) {
                    return _convertToBase64(blob);
                }).then(function(imageDataUrl) {
                    images.push(imageDataUrl);
                    return;
                });
            });
        }
        return chain.then(function() { return images; });
    }
    
    function _getAttachmentBlob(r, t) {
        return Pouch.db.getAttachment(t.receiptDocId, r.attachId)
            .then(function(imgBlob) {
                return imgBlob;
            }).catch(function(err) {
                console.error('Receipt_getImageUrl: ' + err);
                return;
            });        
    }
    
    function _convertToBase64(blob) {
        //wrap in $q ctor to convert from callback to promise design and get in angular scope
        return $q(function(resolve, reject) {
            var reader = new window.FileReader();
            reader.onload = function(e) {
                //process the fileReader base64 to be compatible w/ that expected by email composer
                base64data = reader.result.replace('data:image/jpeg;base64,', 'base64:image.jpg//');
                resolve( base64data );
            }
            reader.onerror = function(err) {
                console.error(err);
                reject(err);
            }
            reader.readAsDataURL(blob);
        });
    }
});