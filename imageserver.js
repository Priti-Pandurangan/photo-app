var express = require('express')
var path = require('path')
var session = require('client-sessions')
var formidable = require('formidable')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs') 

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'priti1994',
	database: 'images'
});

connection.connect(function(err) {
	if (!err)
		console.log('Database is connected')
	else
		console.log('Error connecting to database')
});

app.use(express.static(__dirname + '/Public'))
app.use(session({
	cookieName: "session",
	secret: "sshh"
}));
app.use(bodyParser.urlencoded({extended: false}))
//app.use(bodyParser.json())

app.get('/', function(request, response) {
	if (request.session.login)
		response.sendFile(__dirname + '/Public/upload.html')
	else
		response.sendFile(__dirname + '/Public/login.html')
});

app.post('/s', function(request, response) {
	var username = request.body.username
	var password = request.body.password
	var email = request.body.email
	if (username == "Priti")
		response.sendFile(__dirname + '/Public/upload.html')
	else
		response.send('This is not your world')
	request.session.login = true

});



app.post('/upload', function(request,response) {
	connection.query('SELECT location FROM images WHERE username = "Priti"', function(err, rows) {
		if (!err) {
			console.log('The solution is: ', rows)
			response.render('images.ejs',{ images: rows })
		}
		else {
			console.log('Error performing query')
		}

		connection.end()
	});

	var form = new formidable.IncomingForm()
	form.parse(request)
	form.on('fileBegin', function(name, file) {
		file.path = __dirname + '/Public/uploads/' + file.name
	});
	form.on('file', function(name, file) {
		console.log('uploaded ' + file.name)
	}); 
});



app.post('/logout', function(request, response) {
	delete request.session.login
	response.sendFile(__dirname + '/Public/login.html')
})

var port = process.env.PORT || 5000

		
app.listen(port, function() {
	console.log('Sample app running on http://localhost:' + port)
});

