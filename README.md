Get Latest Release
==================

A simple Github action to get the latest release from another repository. No authentication required.

Configuration
=============

Example Repository - https://github.com/pozetroninc/github-action-get-latest-release

**Inputs**

Name | Description | Example
--- | --- | ---
owner | The Github user or organization that owns the repository |  pozetroninc
repo | The repository name | github-action-get-latest-release

**or**
Name | Description | Example
--- | --- | ---
repository | The repository name in full | pozetroninc/github-action-get-latest-release

**Additional Inputs (Optional)**
Name | Description | Example
--- | --- | ---
token | Github authentication token to use. | "ghp_r900DUmu9Q3elmwWfvqUHpN9F5adxp1r99VF" or a secret
and_filters | Return a release that matches all the filters in the list. | "prerelease: false, tag_name: 5, name: dev"
regex_filters | Return a release that matches all the regex filters in the list. | 'tag_name: /^v[0-9]+\.[0-9]+\.[0-9]+-dev-[0-9]+$/'

NOTE: The 'and_filters' are and'ed together (duh...).
</br>
NOTE2: The filtered release will contain (rather than match) all the filters.
</br>
i.e. filtering "tag_name: 5" might return a release with tag_name "v5.0.4-dev-39" as it contains '5'

**Outputs**

- `url` The HTTP URL for this release
- `assets_url`: The REST API HTTP URL for this release's assets
- `upload_url`: The REST API HTTP URL for uploading to this release
- `html_url`: The REST API HTTP URL for this release
- `id`: The release id
- `node_id`: The unique identifier for accessing this release in the GraphQL API
- `tag_name`: The name of the release's Git tag
- `target_commitish`: ''
- `name`: The title of the release
- `body`: The description of the release
- `draft`: Whether or not the release is a draft
- `prerelease`: Whether or not the release is a prerelease
- `author_id`: The author id
- `author_node_id`: The unique identifier for accessing this release's author in the GraphQL API
- `author_url`: The REST API HTTP URL for this release's author
- `author_login`: The username used to login.
- `author_html_url`: The HTTP URL for this release's author
- `author_type`: ''
- `author_site_admin`: Whether or not this user is a site administrator

Usage Example
=============
``` yaml
name: Build Docker Images
on: [push, repository_dispatch]

jobs:
  build:
    name: RedisTimeSeries
    runs-on: ubuntu-latest
    steps:
      - id: keydb
        uses: oz-elhassid/get-latest-release@master
        with:
          owner: JohnSully
          repo: KeyDB
          and_filters: "prerelease: false, tag_name: 5, name: dev"
          token: ${{ secrets.CLONE_TOKEN }}
      - id: timeseries
        uses: oz-elhassid/get-latest-release@master
        with:
          repository: RedisTimeSeries/RedisTimeSeries
      - uses: actions/checkout@v2
      - uses: docker/build-push-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          repository: pozetroninc/keydb-timeseries
          dockerfile: timeseries.dockerfile
          build_args: KEY_DB_VERSION=${{ steps.keydb.outputs.tag_name }}, REDIS_TIME_SERIES_VERSION=${{ steps.timeseries.outputs.tag_name }}
          tags: latest, ${{ steps.keydb.outputs.tag_name }}_${{ steps.timeseries.outputs.tag_name }}

```

To use the current repo:
``` yaml
with:
  repository: ${{ github.repository }}
```
