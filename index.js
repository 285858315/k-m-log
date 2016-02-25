'use strict'
var moment = require("moment")
var _ = require("lodash")
var onFinished = require("on-finished")
var toString = require("lodash.tostring")
var num = 0
var Log = function Log(opts){
	opts = opts || {}
	opts.name = opts.name || "log"
    opts.limit = opts.limit || 200
	return function (req,res,next){
		if(typeof req[opts.name] != 'undefined'){
			throw Error(opts.name + " has been defined")
		}
		num += 1
		var log = req[opts.name + "data"] || []
		req[opts.name] = function(){
			var args = Array.prototype.slice.call(arguments)
			_.forEach(args,function(item,index){
				if(typeof item == "object"){
					args[index] = JSON.stringify(item)
				}
                args[index] = toString(args[index]).slice(0,opts.limit)
			})
			if(args.length){
				log = log.concat(args.join(" "))
			}
		}
		var time = Date.now();
        var _onFinished = opts.onFinished || onFinished
        _onFinished(res,function(err,res){
            log.forEach(function(item,index){
                console.log(index+1+".",item)
            })
            console.log(
                [
                    "-----------",
                    "end"+num,
                    moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                    Date.now() -time+"ms",
                    "-----------"
                ].join(" ")
            )
        })
        next && next()
	}
}

module.exports = Log