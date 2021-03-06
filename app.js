var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//加载路由文件
var songs = require('./routes/songs');


//使用项目依赖的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  String.prototype.format=function()  {  
      if(arguments.length==0) return this;  
      for(var s=this, i=0; i<arguments.length; i++)  
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
      return s;  
    };
    
  next();
})


app.use('/api/songs', songs);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
