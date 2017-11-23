requirejs(['../../scripts/socket.io-p2p/socketiop2p.min', '../../scripts/socket.io-client/dist/socket.io'],
function   (P2P, io) {
    console.log("in");
    // var P2P = require('socket.io-p2p');
	// var io = require('socket.io-client');
	var socket = io();
	var opts = { numClients: 10 }; // connect up to 10 clients at a time
	var opts = {autoUpgrade: true, peerOpts: {numClients: 10}};
	var p2psocket = new P2P(socket, opts);
	p2psocket.on('peer-msg', function (data) {
	  console.log('From a peer %s', data);
	  $('#inputMessage').append(data);
	});
	$('#sendMessageButton').click(function (){
		var data=$('#inputMessage').val();
		socket.emit('chat message', data);
	})
});