var mongoose = require=('mongoose');
mongoose.connect('mongodb://localhost:27017');
module.exports = {
	verifyCredentials: function (credentials){
		console.log(credentials);
	},
	addCredentials: function (credentials){
		console.log(credentials);

	}
}