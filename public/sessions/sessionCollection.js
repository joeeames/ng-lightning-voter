angular.module('app').factory('sessionCollection', function($firebaseArray) {
  var SessionCollection = $firebaseArray.$extend({
    getUnreviewedCount: function(userKey, reviewedSessions) {
      var total = 0;
      angular.forEach(this.$list, function(session) {
        if(typeof reviewedSessions[session.$id] === 'undefined') {
          total++;
        }
      });
      return total;
    },
    getNextUnreviewedSession: function(userKey, reviewedSessions) {
      console.log(this.$list);
      var found = this.$list.find(function(session) {
        return typeof reviewedSessions[session.$id] === 'undefined'
      });
      console.log(found);
      return found;
    }
  });
  
  return function(ref) {
    return new SessionCollection(ref);
  }
})