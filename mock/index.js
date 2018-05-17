var express = require("express");
var app = express();
var api = require('./api');

app.use(express.static('mock/public'))
//设置跨域访问
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

//   if (req.method == 'OPTIONS') {
//     res.send(200); /让options请求快速返回/
//   }
//   else {
//     next();
//   }
// });
app.get("/", function (req, res) {
  res.send("element-ui-pro");
});

app.use("/api", api);


app.listen(4000);
