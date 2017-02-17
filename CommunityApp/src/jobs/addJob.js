import {inject} from 'aurelia-framework';
import {DataRepository} from 'services/dataRepository';
import {ValidationRules, ValidationController, validateTrigger} from 'aurelia-validation';


@inject(DataRepository, ValidationController)
export class AddJob {
	constructor(dataRepository, validationController) {
		this.job = { jobType: "Full Time", jobSkills: []};
		this.dataRepository = dataRepository;
		this.dataRepository.getStates().then(states=> {
			this.states = states;
		});
		this.dataRepository.getJobTypes().then(jobTypes => {
			this.jobTypes = jobTypes;
		})
		this.dataRepository.getJobSkills().then(jobSkills =>{
			this.jobSkills = jobSkills;
		});		

		this.validationController = validationController;
		this.validationController.validateTrigger = validateTrigger.change;

		ValidationRules
		.ensure(j=>j.title)
		.required()
		.minLength(3)
		.on(this.job);
	}

	activate(params, routeConfig, navigationInstruction) {
		this.router = navigationInstruction.router;
	}

	save() {
		this.validationController.validate().then(result=>{
		if(this.validationController.errors && this.validationController.errors.length > 0) return;
		if(this.job.needDate){
			this.job.needDate = new Date(this.job.needDate);
		}	
		this.dataRepository.addJob(this.job).then(job => this.router.navigateToRoute('jobs'));
		});
	}
}