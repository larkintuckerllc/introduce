var http = require("http");
var reqsIndex = [];
var reqs = {};
var channelsIndex = [];
var channels = {};
var messages = [];

http.createServer(function(req, res) {
	var TIMEOUT = 30000;
	var action = 'error';
	var _id;
	var token;
	var data;
	var regex = /^\/([^\/]*)\/([^\/]*)$/;
	var match = req.url.match(regex);
	if (match) {
		action = match[1];
		_id = match[2];
		if ((action == 'open') || (action == 'close')) {
			regex = /^(.*)\?token=(.*)$/;
			match = _id.match(regex);
			if (match) {
				_id = match[1];
				token = match[2];
			}
		}
		// TODO JET: REMOVED SECRET
		if (action == 'message') {
			regex = /^(.*)\?token=XXXXX&data=(.*)$/;
			match = _id.match(regex);
			if (match) {
				_id = match[1];
				data = JSON.parse(decodeURI(match[2]));
			}
		}
	};
	switch(action) {
		case 'open':
			var now = new Date();
			var position = channelsIndex.indexOf(_id);
			var error = false;
			var timeout = TIMEOUT;  
			if (position == -1) {
				timeout = 1000;
				channelsIndex.push(_id);
				channels[_id] = {
					expiration: now.getTime() + TIMEOUT + 20000,
					token: now.getTime().toString(),
					locked: false
				};
			} else {
				if (token == channels[_id].token) {
					channels[_id].expiration = now.getTime() + TIMEOUT + 20000;
				} else {
					error = true;
				}
			}
			if (!error) {
				res.writeHead(200,{
					'Content-Type': 'application/json', 
					'cache-control': 'private, max-age=0, no-cache',
					'Access-Control-Allow-Origin': '*'
				});
				reqsIndex.push(_id);
				reqs[_id] = {
					_id: _id,
					expiration: now.getTime() + timeout,
					res: res
				};
			} else {
				res.writeHead(401,{
					'Content-Type': 'text/plain', 
					'cache-control': 'private, max-age=0, no-cache',
					'Access-Control-Allow-Origin': '*'
				});
				res.end("");
			}
			break;
		case 'message':
			if (channelsIndex.indexOf(_id) != -1) {
				if (!channels[_id].locked) {
					messages.splice(0,0,{"_id":  _id, data: data});
					res.writeHead(200,{
						'Content-Type': 'application/json', 
						'cache-control': 'private, max-age=0, no-cache',
						'Access-Control-Allow-Origin': '*'
					});
					res.end("{}");
				} else {
					res.writeHead(410,{
						'Content-Type': 'text/plain', 
						'cache-control': 'private, max-age=0, no-cache',
						'Access-Control-Allow-Origin': '*'
					});
					res.end("");
				}
			} else {
				res.writeHead(404,{
					'Content-Type': 'text/plain', 
					'cache-control': 'private, max-age=0, no-cache',
					'Access-Control-Allow-Origin': '*'
				});
				res.end("");
			}
			break;
		case 'close':
			var position = channelsIndex.indexOf(_id);
			if (position != -1) {
				if (token == channels[_id].token) {
					channels[_id].locked = true;
					messages.push({"_id":  _id, close: true});
					res.writeHead(200,{
						'Content-Type': 'application/json', 
						'cache-control': 'private, max-age=0, no-cache',
						'Access-Control-Allow-Origin': '*'
					});
					res.end("{}");
				} else {
					res.writeHead(401,{
						'Content-Type': 'text/plain', 
						'cache-control': 'private, max-age=0, no-cache',
						'Access-Control-Allow-Origin': '*'
					});
					res.end("");
				}
			}
			break;
		default:
			res.writeHead(400,{
				'Content-Type': 'application/json', 
				'cache-control': 'private, max-age=0, no-cache',
				'Access-Control-Allow-Origin': '*'
			});
			res.end("{}");
	}

}).listen(3001);

setInterval(function() {
	var now = new Date();
	var nowTime = now.getTime();

	// CLOSING REQS
	var reqsIndexLength = reqsIndex.length;
	for (var i = reqsIndexLength - 1; i >= 0; i--) {
		var req = reqs[reqsIndex[i]];
		if (req.expiration <= nowTime) {
			req.res.end(JSON.stringify({token: channels[req._id].token}));
			delete reqs[reqsIndex[i]];
			reqsIndex.splice(i,1);
		}
	}

	// DELETING EXPIRED CHANNELS
	var channelsIndexLength = channelsIndex.length;
	for (var i = channelsIndexLength - 1; i >= 0; i--) {
		var messagesLength = messages.length;
		if (channels[channelsIndex[i]].expiration <= nowTime) {
			for (var j = messagesLength - 1; j >= 0; j--) {
				if (messages[j]._id == channelsIndex[i]) {
					messsagesIndex.splice(j,1);
				}
			}	
			delete channels[channelsIndex[i]];
			channelsIndex.splice(i,1);
		}
	}

	// SENDING MESSAGES
	var messagesLength = messages.length;
	for (var i = messagesLength - 1; i >= 0; i--) {
		var position = reqsIndex.indexOf(messages[i]._id);
		if (position != -1) {
			var req = reqs[reqsIndex[position]];

			// CLOSING CHANNEL
			if (messages[i].close) {
				req.res.end(JSON.stringify({token: channels[req._id].token, close: true}));
				delete channels[req._id];	
				channelsIndex.splice(channelsIndex.indexOf(req._id),1);

				// CLEAN-UP ON CLOSE
				// TODO JET: REMOVED SECRET
				var options = {
					hostname: 'introduce.solutions',
					port: 80,
					path: '/channels/' + req._id + '?token=XXXXX',
					method: 'DELETE'
				};
				var req2 = http.request(options, function(res2) {
					res2.on('data', function (chunk) {
					});
					res2.on('end', function () {
					});
				});
				req2.on('error', function(e) {
				});
				req2.end();
			} else {
				req.res.end(JSON.stringify({token: channels[req._id].token, data: messages[i].data}));
			}
			delete reqs[reqsIndex[position]];
			reqsIndex.splice(position,1);
			messages.splice(i,1);
		}
	}	
}, 1000);
