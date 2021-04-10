const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");

const repository = core.getInput('repository');
let owner = core.getInput('owner');
let repo = core.getInput('repo');
const and_filters = core.getInput('and_filters').trim().split(",").map(x => x.trim());
const token = core.getInput('token');

const octokit = (token ? new Octokit({ auth: token }) : new Octokit());

async function run() {
    try {
        if (repository) {
            [owner, repo] = repository.split("/");
        }
        let releases  = await octokit.repos.listReleases({
            owner: owner,
            repo: repo,
            per_page: 100,
            });
        releases = releases.data;
        and_filters.forEach(element => {
            let [key, value] = element.split(":").map(x => x.trim());
            releases = releases.filter(x => x[key].toString().includes(value));
        });
        if (releases.length) {
            core.setOutput('url', releases[0].url);
            core.setOutput('assets_url', releases[0].assets_url);
            core.setOutput('upload_url', releases[0].upload_url);
            core.setOutput('html_url', releases[0].html_url);
            core.setOutput('id', releases[0].id.toString());
            core.setOutput('node_id', releases[0].node_id);
            core.setOutput('tag_name', releases[0].tag_name);
            core.setOutput('target_commitish', releases[0].target_commitish);
            core.setOutput('name', releases[0].name);
            core.setOutput('body', releases[0].body);
            core.setOutput('draft', releases[0].draft.toString());
            core.setOutput('prerelease', releases[0].prerelease.toString());
            core.setOutput('author_id', releases[0].author.id.toString());
            core.setOutput('author_node_id', releases[0].author.node_id);
            core.setOutput('author_url', releases[0].author.url);
            core.setOutput('author_login', releases[0].author.login);
            core.setOutput('author_html_url', releases[0].author.html_url);
            core.setOutput('author_type', releases[0].author.type);
            core.setOutput('author_site_admin', releases[0].author.site_admin.toString());
            core.info("Latest release tag: " + releases[0].tag_name);
        } else {
            core.setFailed("No valid releases");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
