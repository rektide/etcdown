var _merge= require('lodash-node/modern'),
  Global= require('./global'),
  Resource= require('koa-resource-router')

var vars= {Iter: '_i',
  ContentType: '_2'
}


module.exports = (function edb(db, name, opts){
	if(!db){
		throw new Error('no db argument provided')
	}
	if(name instanceof Object){
		opts= name
		name= null
	}
	name= name|| 'edb'
	var prefix= opts.prefix|| name
	var global= Global(db)

	function *inOrderCreate(next) {
		// build global index
		var index= yield global.get()
		// build key
		this.key= this.key||[]
		this.key.push(name)
		var key= this.key.join(':')

		// build response node of content
		this.resNode= _merge({}, this.body, { "createdIndex": index,
			"key": key,
			"modifiedIndex": iter })

		// write node to db
		var put= yield db.put(key, this.resNode)

		// write reply to client
		global.headers(this.res, index)
		this.res.body= { "action": "create",
			"node": this.resNode}
	}

	function *get(next){
		// build key
		this.key= this.key||[]
		var key= this.key.join(':')

		// get node from db
		var get= yield db.get(key)

		// write reply to client
		global.headers(this.res, index)
		this.res.body= {"action": "get",
			"node": get}
	}

	var edb = new Resource(name, {
		// GET /[resource name]
		index: function *(next) {
			
		},
		// POST
		create: inOrderCreate,
		// GET /new
		new: inOrderCreate,
		// GET /:id
		show: function *(next) {
			
		},
		// GET /:id/edit
		edit: function *(next) {
		},
		// PUT /:id
		update: function *(next) {
		},
		// DELETE /:id
		destroy: function *(next) {
		}
	});
})
