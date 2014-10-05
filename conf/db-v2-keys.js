{
	instance: [{
		name: "v2-keys",
		prefix: "v2/keys",
		levelup: {
			type: "jsondown",
			0: "lib/db-keys.json"
		}
	}]
}
