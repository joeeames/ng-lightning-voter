angular.module('app').component('adminCreateUsers', {
  templateUrl: '/admin/createUsers.html',
  bindings: {
    users: '='
  },
  controller: function(parseNames, $firebaseAuthService, $firebaseRef, $firebaseObject) {
    this.errorMessages = [];
    
    var usersObj = $firebaseObject($firebaseRef.default.child('users'));
    
    this.import = function() {
      var people = parseNames(this.namesblob);
      console.log(usersObj);
      people.forEach((function(person) {
        console.log(person);
        $firebaseAuthService.$createUser({
          email: person.email,
          password: "pass"
        }).then(function(userdata) {
          // this.users.$add(person);
          usersObj[userdata.uid] = person;
          console.log(usersObj);
          usersObj.$save();
          
        }).catch((function(error) {
          this.errorMessages.push("User already exists: " + person.email);
        }).bind(this))
      }).bind(this));
      
      
      this.message = "Users Created!";
      setTimeout((function() {
        this.message = "";
      }).bind(this), 2000)
    }
    
    this.errorMessagesDisplay = function() {
      return this.errorMessages.join('\r\n');
    }
  }
})