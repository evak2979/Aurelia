import {jobsData, states, jobTypes, jobSkills} from 'services/jobsData';
import {BindingSignaler} from 'aurelia-templating-resources';
import {inject}	from 'aurelia-framework';
import moment from 'moment';
import {HttpClient} from 'aurelia-http-client';
import {HttpClient as HttpFetch, json} from 'aurelia-fetch-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {NotificationPayload} from 'common/NotificationPayload';

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

@inject(BindingSignaler, HttpClient, 'apiRoot', HttpFetch, EventAggregator)
export class DataRepository {
	constructor(bindingSignaler, httpClient, apiRoot, httpFetch, eventAggregator){
		this.httpFetch = httpFetch;
		this.httpClient = httpClient;
		this.apiRoot = apiRoot;
		this.eventAggregator = eventAggregator;
		setInterval(()=> {bindingSignaler.signal('check-freshness')},1000);
		setTimeout(()=> this.backgroundNotificationReceived(this.eventAggregator), 5000);
	}

	backgroundNotificationReceived(ea){
		ea.publish(new NotificationPayload(moment().format("HH:mm:ss")));
	}

	getEvents(pastOrFuture) {
			var promise = new Promise((resolve, reject) => {
				if (!this.events) {
					this.httpClient.get(this.apiRoot + '/api/Events')
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
			this.httpFetch.fetch(this.apiRoot + '/api/Jobs',{
				method: 'Post',
			body: json(job)
			}).then(response => response.json())
			.then(data => {
				this.jobsData.push(data);
				resolve(data);
			}).catch(err=>reject(err));
		});
		return promise;
	}	

	getJobsData(){
		var promise = new Promise((resolve, reject)=>{
			if(!this.jobsData){
				this.httpFetch.fetch(this.apiRoot + '/api/Jobs')
				.then(result => result.json())
				.then(data =>
				{ 
				this.jobsData = data
				resolve(this.jobsData);
				}).catch(err => reject(err));			
			}
			else
			{
				resolve(this.jobsData);
			}
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