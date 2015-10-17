'use strict'
var moment = require("moment")
var _ = require("lodash")
var onFinished = require("on-finished")
var num = 0
var Log = function Log(opts){
	opts = opts || {}
	opts.name = opts.name || "log"
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
			})
			if(args.length){
				log = log.concat(args.join(" "))
			}
		}
		var time = Date.now()
		onFinished(res,function(err,res){
			console.log(log.join("\n"))
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
		next()
	}
}
module.exports = Log