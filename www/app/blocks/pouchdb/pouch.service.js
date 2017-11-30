angular.module('blocks.pouchdb')

.service('Pouch', function() {
    var self = this;
    self.db = new PouchDB('reimburse');
    
    return self;    
});