var _merge= require('lodash-node/modern/objects/merge'),
  co= require('co'),
  nconf= require('nconf')
    .argv()
    .env()

var envs= (nconf.get('NODE_ENV')||'development').split(',')
nconf.set('NODE_ENV', envs)
nconf.set('envs', envs)

nconf.add('default', {type: 'file', file: 'conf/default.json'})

nconf.add('default-instance', {type: 'file', file: 'conf/default-instance.json'})
var defaultInstance= nconf.get('instance')
if(!(defaultInstance instanceof Object) && defaultInstance.instance instanceof Object)
	throw 'Unexpected default-instance'
nconf.remove('default-instance')

var _instances= {}
var loadInstance= co(function*loadInstance(instance){
	instance.prefix= instance.prefix|| instance.name

	console.log('instance', instance)
	console.log('instance', instance, instance.levelup.type)
	var levelup= instance.levelup,
	  db= instance.db= require(levelup.type)(levelup.location),
	  open= _merge({db: instance.db||instance.name}, defaultInstance, levelup.open)
	var err= yield db.open(open)
	if(err)
		throw err
	nconf.set(instance.name, instance)
	_instances[instance.name] = instance
})

for(var i in envs){
	var env= envs[i]
	try{
		nconf.add(env, {type: 'file', file: './conf/'+env+'.json'})
	}catch(ex1){
		try{
			nconf.add(env, {type: 'file', file: './conf/'+env+'.json'})
		}catch(ex2){
			console.warn('No success finding '+env+'.json conf file;', ex1, ex2)
		}
	}
	var instance= nconf.get('instance')
	if(instance && instance.instance){
		if(instance.instance instanceof Object)
			instance.instance= [instance]
		instance.instance.forEach(loadInstance)
	}
	nconf.remove(env)
}

nconf.set('instance', _instances)
nconf.set('PORT', nconf.get('PORT')||4001)

module.exports= nconf
