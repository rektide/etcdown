var koa

var app= module.exports= (function app=(app){
	if(!app){
		if(!koa)
			koa= require('koa')
		app= koa()
	}
	var conf= require('./conf')(),
	  edb= require('./edb')(conf.db, conf.name)
	app
	  .use(edb)
	  .listen(conf.port)
	return app.use(edb)
})

if(require.main == module){
	app()
}
