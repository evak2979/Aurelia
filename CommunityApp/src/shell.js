import toastr from 'toastr';
import moment from 'moment';

export class Shell {
	constructor() {
		setInterval(()=>this.timeIs = moment().format("hh:mm:ss.SSS"),100);
	}
	configureRouter(config, router) {
		this.router = router;
		config.title = "Capital Area .NET User Group";
		//config.addPipelineStep('authorize', ToastNavResult);
		//config.options.pushState = true;
		config.map([
				{ route: ['', 'events'], 
					viewPorts: { mainContent: {moduleId: 'events/events'}, 
					sideBar: {moduleId: 'sideBar/sponsors'}} , 
					name: 'Events', title: 'Events', nav: true},
				{ route: 'jobs', name: 'jobs', viewPorts: { mainContent: {moduleId: 'jobs/jobs'}, 
					sideBar: { moduleId: 'sideBar/sponsors'}},  
					title: 'Jobs', nav: true },
				{ route: 'discussion', viewPorts: { mainContent: {moduleId: 'discussion/discussion'}, 
					sideBar: { moduleId: 'sideBar/ads'} } , 
					title: 'Discussion', nav:true },
				{ route: 'eventDetail/:eventId', viewPorts: { mainContent: { moduleId: 'events/eventDetail'}, 
					sideBar: { moduleId: 'sideBar/ads'} } , name: 'eventDetail'},
				{ route: 'addJob', name: 'addJob', viewPorts: 
					{ mainContent: {moduleId: 'jobs/addJob'}, sideBar: { moduleId: 'sideBar/sponsors'}}}
	
		]);
	}
}

	class ToastNavResult {
	  run(navigationInstruction, next) {
	    return next().then(a=>  { if (a.status != "completed") { toastr.info(a.status); } return a; });
	  }
	}
