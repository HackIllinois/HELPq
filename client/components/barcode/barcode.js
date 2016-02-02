if (Meteor.isCordova) {
    Template.barcode.helpers({
        isCordova: function() {
            return Meteor.isCordova;
        }
    });
  Template.barcode.events({
    'click button': function () {

      cordova.plugins.barcodeScanner.scan(
        function (result) {
            Router.go('/user/'+result.text);
        },
        function (error) {
          alert("Scanning failed: " + error);
        }
     );

    }

  });

}
