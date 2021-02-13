module.exports = function (plop) {
	// controller generator
	plop.setGenerator('controller', {
    description: 'Krypton ECS Typings',
    prompts: [],
		actions: [{
			type: 'add',
			path: './node_modules/@kryptonstudio/ecs_controller/controller.td',
			templateFile: 'plop-templates/controller.td.hbs'
		}]
	});
};