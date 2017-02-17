import {jobsData, states, jobTypes, jobSkills} from 'services/jobsData';
import {BindingSignaler} from 'aurelia-templating-resources';
import {inject}	from 'aurelia-framework';
import moment from 'moment';
import {HttpClient} from 'aurelia-http-client';

function filterAndFormat(pastOrFuture, events) {
	var results = JSON.parse(JSON.stringify(events));
	if (pastOrFuture == 'past') {
		results = results.filter(item => moment(item.dateTime) < moment());
	}
	else if (pastOrFuture == 'future') {
		results = results.filter(item => moment(item.dateTime) > moment());
	}
	else {
		results = results;
	}
	results.forEach(item => {
		var dateTime = moment(item.dateTime)
			.format("MM/DD/YYYY HH:mm");
			item.dateTime = dateTime;
	});

	return results;
}

@inject(BindingSignaler, HttpClient)
export class DataRepository {
	constructor(bindingSignaler, httpClient){
		this.httpClient = httpClient;
		setInterval(()=>{bindingSignaler.signal('check-freshness')},1000);
	}

	getEvents(pastOrFuture) {
			var promise = new Promise((resolve, reject) => {
				if (!this.events) {
					this.httpClient.get('http://localhost:27092/api/Events')
					.then(result=>{
						var data = JSON.parse(result.response);
						this.events = data.sort((a,b)=> a.dateTime >= b.dateTime ? 1 : 0);
						resolve(filterAndFormat(pastOrFuture, this.events));
					})
				}
				else {
					resolve(filterAndFormat(pastOrFuture, this.events));
				}
			});
			return promise;
		}

	addJob(job){
		var promise = new Promise((resolve,reject)=>{
			this.jobsData.push(job);
			resolve(job);
		});
		return promise;
	}	

	getJobsData(){
		var promise = new Promise((resolve, reject)=>{
			if(!this.jobsData){
				this.jobsData = jobsData;
			}
			resolve(this.jobsData);
		})	
		return promise;
	}

	getStates(){
		var promise = new Promise((resolve, reject)=>{
			if(!this.states){
				this.states = states;
			}
			resolve(this.states);
		})

		return promise;
	}

	getJobTypes(){
		var promise = new Promise((resolve, reject)=>{
			if(!this.jobTypes){
				this.jobTypes = jobTypes;
			}
			resolve(this.jobTypes);
		})

		return promise;
	}

	getJobSkills(){
		var promise = new Promise((resolve, reject)=>{
			if(!this.jobSkills){
				this.jobSkills = jobSkills;
			}
			resolve(this.jobSkills);
		})

		return promise;
	}	

	getEvent(eventId) {
		return this.events.find(item => item.id == eventId);
	}
}