var koa;

var app= module.exports= (function app(app){
	var haveApp = !!app
	if(!app){
		if(!koa)
			koa= require('koa')
		app= koa()
	}
	var conf= require('./conf')
	for(var name in conf.instance){
		var instance= conf.instance[name],
		  edb= require('./edb')(conf.db, conf.name)
		app.use(edb)
	}
	if(!haveApp){
		var port= conf.get('PORT')
		console.log('start; port:',port)
		app.listen(port)
	}
})

if(require.main == module){
	app()
}
