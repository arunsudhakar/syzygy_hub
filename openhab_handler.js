require('log-timestamp')(function() { return '[' + new Date().toISOString() + '] %s' });
const mqtt = require('mqtt')

const { exec } = require("child_process");

const client = mqtt.connect('mqtt://{HOST}')
var commandTopic = 'cmnd/system'

client.on('connect', () => {
	console.log("Connected to broker. Waiting for messages");
	client.subscribe(commandTopic)
})

client.on('message', (topic, message) => {
	console.log(topic);
	if(topic == commandTopic)
		return handleSystemCommand(message)
})
function handleSystemCommand(message)
{
	if(message == 'system')
	{
		console.log("Restart System")
		exec("sudo halt -p", (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		});
	}
	else if(message == 'openhab')
	{
		console.log("Restart Open")
		exec("docker restart openhab", (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		});
	}
}
function handleAppExit (options, err) {
  if (err) {
    console.log(err.stack)
  }

  if (options.exit) {
    process.exit()
  }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {
  exit: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
  exit: true
}))

