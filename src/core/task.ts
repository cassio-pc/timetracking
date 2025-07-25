// import 3th party packages
import * as _ from 'lodash/array';
import * as moment from 'moment';

// import models
import { TaskStatus } from './task-status';

export class Task {
	public name: string;
	public description: string;
	public status: TaskStatus;
	public log: any[];

	constructor(name: string, values: any) {
		this.name = name;
		if (values) {
			this.description = values.description;
			this.status = values.status;
			this.log = values.log;
		} else {
			this.description = '';
			this.status = TaskStatus.IN_PROGRESS;
			this.log = [];
		}
	}

	public setDescription(description: string): void {
		if (description) {
			this.description = description;
		} else {
			this.description = '';
		}
	}

	public setStatus(status: TaskStatus): void {
		this.status = status;
	}

	public start(description: string): boolean {
		let lastTime = _.last(this.log);
		if (lastTime && lastTime.start && !lastTime.stop) {
			console.log('This task already has been started.');
			return false;
		}
		this.log.push({
			start: moment().format(),
		});
		this.setDescription(description);
		this.setStatus(TaskStatus.IN_PROGRESS);
		return true;
	}

	public stop(status: TaskStatus, timestamp?: moment.Moment): boolean {
		let lastTime = _.last(this.log);
		if (this.status === status) {
			let msg = status === TaskStatus.FINISHED ? 'completed' : 'paused';
			console.log('This task already has been %s.', msg);
			return false;
		}
		if (lastTime && !lastTime.stop) {
			this.log[this.log.length - 1].stop = (timestamp || moment()).format();
		}
		this.setStatus(status);
		return true;
	}

	public add(date: string, dateFormat: string, hour: number, min: number): boolean {
		let stop = moment(date, dateFormat);
		stop.add(hour, 'h');
		stop.add(min, 'm');
		this.log.unshift({
			start: moment(date, dateFormat).format(),
			stop: stop.format()
		});
		return true;
	}
}
