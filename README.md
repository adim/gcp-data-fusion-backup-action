# GCP data fusion backup

An action for backup Google data fusion pipelines.

# Usage

See [action.yml](action.yml)

```yaml
steps:
- uses: adim/gcp-data-fusion-backup-action@main
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
    fusion-url: '{YOUR-INSTANCE-NAME}-dot-usc1.datafusion.googleusercontent.com'
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
