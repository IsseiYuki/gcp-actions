# Deploy Cloud Scheduler action

This action helps you in deploying your jobs to Cloud Scheduler.

## Configuration

Key | Value | Required | Default
:--: | :-- | :--: | :--: | :--:
`CREDENTIALS` | Your JSON GCP service account key. | **Yes** | N/A

## Inputs

### `jobs_path`

**Required** Configuration file path of jobs.

### `group_prefix`

Group prefix to use for targeting jobs.

### `location_id`

**Required** ID of the location. see: https://cloud.google.com/about/locations/

### `credentials`

**Required** Credentials to use for authentication.

## Example usage

```
uses: IsseiYuki/gcp-actions/scheduler@master
  with:
    jobs_path: 'cloud/jobs.json'
    project_id: 'YOUR-PROJECT-ID'
    location_id: 'YOUR-LOCATION-ID'
  env:
    CREDENTIALS: ${{ secrets.GCP_CREDENTIALS }}
```