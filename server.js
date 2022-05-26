const express = require('express');
const dotenv = require('dotenv');
var app = express();
var path = require('path');
var Mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session') ;
var fs = require('fs');
var multer = require('multer');
var passwordHash = require('password-hash');
var TABLE = 'user';
var TABLETOW = 'TitleFile';
var TABLETHREE = 'typeFile';
var TABLEFOUR = 'Files';


// connect to db
var con = Mysql.createConnection({
    host:"localhost",
    user: "root",
    password : "",
    database: "FileManagerDb"
});
con.query("SET CHARACTER SET utf8");

app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
    secret : "secret" ,
    resave : false ,
    saveUninitialized : true
})) ;

// viewed at http://localhost:8081
app.use(express.static(__dirname + '/view'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/first.html'));
});
app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/home.html'));
});

/*app.get("/login" , function(req,res) {
    res.sendFile(path.join(__dirname + '/view/first.html'));
});*/
app.get("/signup" , function(req,res) {
    res.sendFile(path.join(__dirname + '/view/mysign.html'));
});

/*app.get("/t" , function(req,res) {
    res.sendFile(path.join(__dirname + '/view/html/test.html'));
});

app.get("/cf" , function(req,res) {
    res.sendFile(path.join(__dirname + '/view/createfile.html'));
});*/

app.post("/s" , function(req,res) {
    var hashedPassword = passwordHash.generate(req.body.password);
    con.query("Insert into "+TABLE+" (username,email,password,image) VALUES ('"+req.body.username+"','"+req.body.email+"','"+hashedPassword+"','"+req.body.img+"')",function(err, result)      
    {                                                      
        if (err) {
            res.send({ok:false});
            var dir = './'+req.body.username;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            };
        }
        else {
            req.session.user = req.body.username;
            res.send({ok:true});
        }
        
    });
});

app.post("/l" , function(req,res) {
    con.query("SELECT * FROM "+TABLE+" WHERE username = '"+req.body.username+ "'", function (err, result) {
        if (err) throw err;
        else {
            if(passwordHash.verify(req.body.password, result[0].password)){
                req.session.user = req.body.username;
                res.send({ok:true});
                var dir = './'+req.body.username;
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                };
            }
            else {
                res.send({ok:false});
            }
        }
      });
});

app.post("/newtitle", function(req,res){
    con.query("SELECT id FROM "+TABLE+" WHERE username = '"+req.session.user+"'",function(err,result){
        if(err) throw err;
        con.query("INSERT into "+TABLETOW+" (name,userID) VALUES ('"+req.body.titlename+"','"+result[0].id+"')" , function(err,result) {
            if(err) throw err;
            else{
                res.redirect('/home');
                var dir = './'+req.session.user+'/'+req.body.titlename;
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                };
            }
        });
    });
})

app.post('/show', function(req, res, next) {
    con.query("SELECT id FROM "+TABLE+" WHERE username = '"+req.session.user+"'",function(err,result){
        if(err) throw err;
        con.query("SELECT * FROM TitleFile WHERE userID = '"+result[0].id+"'" , function(err,data){
            if (err) {
                callback("error", err)
            } else {
                res.json(data);
            }
        });
    });
});

app.post('/newfile' , function(req,res){
    con.query("SELECT id FROM "+TABLE+" WHERE username = '"+req.session.user+"'",function(err,result){
        if(err) throw err;
        con.query("SELECT id FROM "+ TABLETOW + " WHERE name = '"+req.body.title+"' AND userID = '"+result[0].id+"'",function(err,datat){
            if(err) throw err;
            con.query("SELECT id FROM "+TABLETHREE+" WHERE name = '"+req.body.type+"'",function(err,datap){
                if(err) throw err;
                var namefile = req.body.filename+'.'+req.body.filetype;
                con.query("INSERT into "+TABLEFOUR+" (name,address,titleID,typeID,userID,description,date) VALUES ('"
                +namefile+"','"+req.body.address+"','"+datat[0].id+"','"+datap[0].id+"','"+result[0].id+"','"
                +req.body.desfile+"','"+req.body.date+"')" , function(err,fidback){
                    if(err) throw err;
                    else {
                        res.send({ok:true});
                        var hashfilename = result[0].id+datat[0].id+'.'+req.body.filetype;
                        var folderpath = './'+req.session.user+'/'+req.body.title+'/'+req.body.type;
                        if (!fs.existsSync(folderpath)){
                            fs.mkdirSync(folderpath);
                        };
                        var dir = path.join(__dirname+'/'+req.session.user+'/'+req.body.title+'/'+req.body.type+'/'+hashfilename) ;
                        fs.writeFile(dir, '', function(err) {
                            if (err) {
                                console.log('saved file');
                                    
                            } else {
                                console.log('Soooryy!');
                            }
                            
                        });
                    }
                });
            });
        } );
    });
});

app.post('/deletefile',function(req,res){
    var query = "DELETE FROM "+TABLEFOUR+" WHERE id = '"+req.body.idfile+"'";
    con.query(query,function(err,result){
        if(err) {res.send({ok:false});};
        res.send({ok:true});
    });
});

app.post('/showfiles' , function(req,res,next){
    con.query("SELECT id FROM "+TABLE+" WHERE username = '"+req.session.user+"'",function(err,data){
        if(err) throw err;
        con.query("SELECT id FROM "+ TABLETOW + " WHERE name = '"+req.body.title+"' AND userID = '"+data[0].id+"'",function(err,datat){
            if(err) throw err;
            con.query("SELECT id FROM "+TABLETHREE+" WHERE name = '"+req.body.typef+"'",function(err,datap){
                if(err) throw err;
                con.query("SELECT id,name FROM "+TABLEFOUR+" WHERE userID = '"+ data[0].id+"' AND titleID = '"+datat[0].id+"' AND typeID = '"+datap[0].id+"'" , function(err,result){
                    if (err) {
                        callback("error", err)
                    } else {
                        res.json(result);
                    }
                });
            });
        });    
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening at ${process.env.PORT}`);
});