const assert = require('assert');
const time = require('../lib/core/timetracking');
const taskStatus = require('../lib/core/task-status');

const Configstore = require('configstore');
const pkg = require('../package.json');

const TEST_NAMESPACE = `${pkg.name}_test`;

const config = new Configstore(TEST_NAMESPACE, {
	config: {
		date_format: 'MM/dd/yyyy',
		pause_others_on_start: true
	},
	tasks: []
});

const timetracking = new time.Timetracking(config);

describe(`${pkg.name} - ${pkg.description}`, () => {

	beforeEach(() => {
		config.set('tasks', []);
	});

	it(':: start a new task', () => {
		timetracking.start('new task', 'this is a new task', true);
		let tasks = config.get('tasks');
		assert.equal(tasks.length, 1);
		assert.equal(tasks[0].status, 0)
	});
	
	it(':: list all tasks by creation date', () => {
		timetracking.list(new Date());
	});

	it(':: pause task', () => {
        let date = new Date();
        let formattedDate;
        if (date.getMinutes().toString().length == 1) {
            formattedDate = date.getHours() + ':0' + date.getMinutes();
        } else {
            formattedDate = date.getHours() + ':' + date.getMinutes();
        }
        timetracking.stop('new task', taskStatus.TaskStatus.PAUSED, formattedDate);
        let tasks = config.get('tasks');
        assert.equal(tasks.length, 1);
        assert.equal(tasks[0].status, 1)
    });

    it(':: stop task', () => {
        let date = new Date();
        let formattedDate;
        if (date.getMinutes().toString().length == 1) {
            formattedDate = date.getHours() + ':0' + date.getMinutes();
        } else {
            formattedDate = date.getHours() + ':' + date.getMinutes();
        }
        timetracking.stop('new task', taskStatus.TaskStatus.FINISHED, formattedDate);
        let tasks = config.get('tasks');
        assert.equal(tasks.length, 1);
        assert.equal(tasks[0].status, 2)		
    });
				
	after(() => {
		config.set('tasks', []);
	});
});