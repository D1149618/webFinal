var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 以下express.js程式碼，使用sqlite3來操作資料庫，並開啟位置在db/sqlite.db的資料庫，需要確認是否成功打開資料庫
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the sqlite database.');
});

// 若rent table 不存在，則會建立rent table
// CREATE TABLE rent (
//     year INTEGER PRIMARY KEY,
//     suite REAL,
//     building REAL
// );
db.run('CREATE TABLE IF NOT EXISTS rent (year INTEGER PRIMARY KEY, suite REAL, building REAL)');

app.post('/api', (req, res) => {
    const name = req.body.name.toString();
    let sql = 'SELECT year, '+name+' FROM rent';
    console.log(sql);
    db.all(sql, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(401).send('Internal Server Error');
        }
        else {
            // console.log(rows);
            res.json(rows);
        }
    });
});

module.exports = app;