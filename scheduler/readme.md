# Deploy Cloud Scheduler action

This action helps you in deploying your jobs to Cloud Scheduler.

## Inputs

### `jobs_path`

**Required** Configuration file path of jobs.

### `group_prefix`

Group prefix to use for targeting jobs.

### `project_id`

**Required** ID of the project.

### `location_id`

**Required** ID of the location. see: https://cloud.google.com/about/locations/

### `service_account_email`

**Required** Service account email address to use for authentication.

### `service_account_key`

**Required** Service account key to use for authentication.

## Example usage

```
uses: IsseiYuki/gcp-actions/scheduler@master
  with:
    jobs_path: 'cloud/jobs.json'
    project_id: 'YOUR-PROJECT-ID'
    location_id: 'YOUR-LOCATION-ID'
    service_account_email: ${{ secrets.GCP_SA_EMAIL }}
    service_account_key: ${{ secrets.GCP_SA_KEY }}
```