var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}

app.put('/login', function (req, res) {
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	var ses = req.session;
    ses.access = false;
    ses.isAdmin = false;

    for (let i = 0; i < users.length; i++) {
        if (users[i].password === req.body.password) {
            ses.access = true;
            
            if (users[i].isAdmin) {
                ses.isAdmin = true;
                ses.userId = users[i].userId;
                res.send("Login"); 
            }
        }
    }
	// res.send("Login");
});

app.put('/logout', function (req, res) {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	// req.session.userId = null;
	// res.send("LogOut");
	var ses = req.session;
    ses.userId = null;
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].password === req.body.password && ses.access === true) {
            ses.access = false;
            res.send("LogOut");
        }
    }
});

var auth = function (req, res, next) {
	// Session Check
	// 어드민 여부 체크 필요
	if (req.session.userId != null) {
    	if (req.session.isAdmin === true)
		next();
    }
	else
		res.send("Error");
};

app.get('/users/:userId', auth,function (req, res) {
	// get User Information
	var ses = req.session;
    
    if (!ses.access) {
        res.send('OK');
    }
    else {
        var userId = req.params.userId;
        res.send(users[userId]);
    }
});

// 사용자 추가 시에 admin 여부도 추가해야 함
app.put('/users', auth, function (req, res) {
    users[req.body.userId] = req.body;
    res.send(users[req.body.usrId]);
})

app.post('/users', auth, function (req, res) {
    var sess = req.session;
    users[req.body.userId] = req.body;
	res.send(users[req.body.userId]);
})

app.delete('/users/:userId', auth, function (req, res) {
    var sess = req.session;
    users.splice(req.body.userId, 1);
    res.send(users[req.body.userId]);
})

var server = app.listen(80);
