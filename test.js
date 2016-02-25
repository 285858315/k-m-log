var Log = require("./index")
var req = {}
var callback
var onFinished = function(err,cb){
    callback = cb
}
var opts = {
    onFinished:onFinished,
    limit:2,
}
Log(opts)(req)
req.log("a",null,[],{a:1},1,0,req.aaa)
callback()