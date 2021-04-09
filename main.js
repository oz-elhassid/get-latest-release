const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");

const repository = core.getInput('repository');
const owner = core.getInput('owner');
const repo = core.getInput('repo');
const type_excludes = core.getInput('excludes').split(",").map(x => x.trim());
const name_includes = core.getInput('includes');
const token = core.getInput('token');

const octokit = (token ? new Octokit({ auth: token }) : new Octokit());

async function run() {
    try {
        if (repository){
                [owner, repo] = repository.split("/");
        }
        var releases  = await octokit.repos.listReleases({
            owner: owner,
            repo: repo,
            per_page: 100,
            });
        releases = releases.data;
        if (type_excludes.includes('prerelease')) {
            releases = releases.filter(x => x.prerelease != true);
        }
        if (type_excludes.includes('draft')) {
            releases = releases.filter(x => x.draft != true);
        }
        if (name_includes) {
            releases = releases.filter(x => x.name.includes(name_includes));
        }
        if (releases.length) {
            core.setOutput('release', releases[0].name);
            core.info("Latest release: " + releases[0].name)
        } else {
            core.setFailed("No valid releases");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
