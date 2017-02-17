import {inject} from 'aurelia-framework'
import {DataRepository} from 'services/dataRepository'

@inject(DataRepository)	
export class Jobs {	
	constructor(dataRepository){
		this.dataRepository = dataRepository;
	}

	activate(params, routeConfig, navigationInstruction){
		this.router = navigationInstruction.router;
		this.dataRepository.getJobsData().then(jobs => this.jobs = jobs);
	}

	addJob(){
		this.router.navigateToRoute('addJob');
	}
}