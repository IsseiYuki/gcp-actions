const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const scheduler = require('@google-cloud/scheduler');
const assert = require('assert');
const merge = require('deepmerge');

async function run() {
  try {
    const jobsPath = core.getInput('jobs_path');
    const groupPrefix = core.getInput('group_prefix');
    const locationId = core.getInput('location_id');
    const credsJson = process.env['CREDENTIALS'];
    if (!credsJson) {
      throw new Error('The $CREDENTIALS environment variable was not found!');
    }
    const creds = JSON.parse(credsJson);

    const json = fs.readFileSync(jobsPath, 'utf8');
    const jobs = JSON.parse(json);

    const client = new scheduler.CloudSchedulerClient({
      credentials: {
        client_email: creds.client_email,
        private_key: creds.private_key,
      },
    });
    const parent = client.locationPath(creds.project_id, locationId);

    const currentJobs = [];
    await client.listJobs({parent: parent})
      .then(responses => {
        const resources = responses[0];
        for (const resource of resources) {
          if (groupPrefix) {
            const name = resource.name.split('/').slice(-1)[0];
            if (name.startsWith(groupPrefix) === false) continue;
          }
          currentJobs.push(resource);
        }
      })
      .catch(err => {
        console.error(err);
        throw err;
      });

    jobs.forEach(job => {
      const fullname = `${parent}/jobs/${job.name}`;
      let currentIndex = 0;
      currentJob = currentJobs.find((j, index) => {
          if (j.name == fullname) {
              currentIndex = index;
              return true;
          };
          return false;
      });

      if (typeof currentJob === 'undefined') {
        // new job
        console.log(`creating new job: ${fullname}`);
        client.createJob(job)
          .then(responses => {
            const response = responses[0];
            console.log(`New job is created successfully: ${response.name}`);
          });
      } else {
        currentJobs.splice(currentIndex, 1);
        
        currentJob.name = job.name;
        if (currentJob.httpTarget !== null) {
          currentJob.httpTarget.body = currentJob.httpTarget.body.toString();
        }
  
        const mergedJob = merge(currentJob, job);
        try {
          assert.deepEqual(currentJob, mergedJob);
          console.log(`no changes: ${fullname}`);
        } catch (error) {
          console.log(`changing this job: ${fullname}`);
          mergedJob.name = fullname;
          client.updateJob({job: mergedJob})
            .then(responses => {
              const response = responses[0];
              console.log(`The job is changed successfully: ${response.name}`);
            });
        }
      }
    });

    currentJobs.forEach(job => {
      console.log(`deleting this job: ${job.name}`);
      client.deleteJob(job.name)
        .then(() => {
          console.log(`The job is deleted successfully: ${job.name}`);
        });
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();