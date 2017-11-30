angular.module('app.settings')

.service('SettingsSvc', function($log, Pouch) {
    var self = this;
    self._id = "settings";
    self.firstName = "";
    self.lastName = "";
    self.email = "";
    self.department = "";
    self.homeCity = "";
    self.defaultPurpose = "";
    self.defaultTitle = "";
    self.lastSaved = new Date();
    
    self.resume = _resume;
    self.pause = _pause;
    
    _init();
    function _init() {
        console.log('SettingsCtrl_init()');
        _resume();
    };
    
    function _resume() {
        _hydrateFromPouch();
    }
    
    //get allDocs and hydrate from results
    function _hydrateFromPouch() {
        return Pouch.db.get('settings', {include_docs:true})
            .then(function(result) {
                return _hydrate(result);
            }).catch(function(err) {
                $log.error(err);
                return false;
            });
    }

    function _hydrate(data) {
        //check for an array of trips in the json data provided
        if (data) {
            angular.extend(self, data);
            return true;
        } else { return false; }
    }    
    
    //get allDocs and hydrate from results
    function _saveToPouch() {
        var self = this;
        return Pouch.db.put(self)
            .then(function(result) {
                $log.log('Saved Settings: ' + self._rev||'');
                return result;
            }).catch(function(err) {
                $log.error(err);
            });
    }
    
    function _pause() {
        //timestamp the settings before saving
        self.lastSaved = new Date();
        return _saveToPouch.call(self);
    }
});

