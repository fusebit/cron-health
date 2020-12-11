# Fusebit CRON health

This is a Fusebit function that tests the health of the CRON infrastructure. It runs every 60 seconds and captures the time of execution in Fusebit storage. It also responds to HTTP GET with HTTP 200 if the last execution was later than 90 seconds ago, and with HTTP 418 otherwise. As such, it can be used as a target endpoint for any automated health monitoring solution, e.g. Uptime.

## Getting started

To deploy the function with name `cron-health` to boundary `internal`:

```
git clone git@github.com:fusebit/cron-health.git
fuse function deploy --boundary internal cron-health -d ./cron-health/fusebit
```

Then use the URL of the function as the target of an automated health check.
