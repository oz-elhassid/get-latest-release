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
            releases = releases.filter(x => x.tag_name.includes(name_includes));
        }
        if (releases.length) {
            core.setOutput('release', releases[0].tag_name);
            core.setOutput('url', releases[0].url)
            core.setOutput('assets_url', releases[0].assets_url)
            core.setOutput('upload_url', releases[0].upload_url)
            core.setOutput('html_url', releases[0].html_url)
            core.setOutput('id', releases[0].id.toString())
            core.setOutput('node_id', releases[0].node_id)
            core.setOutput('tag_name', releases[0].tag_name)
            core.setOutput('target_commitish', releases[0].target_commitish)
            core.setOutput('name', releases[0].name)
            core.setOutput('body', releases[0].body)
            core.setOutput('draft', releases[0].draft)
            core.setOutput('prerelease', releases[0].prerelease)
            core.setOutput('author_id', releases[0].author.id.toString())
            core.setOutput('author_node_id', releases[0].author.node_id)
            core.setOutput('author_url', releases[0].author.url)
            core.setOutput('author_login', releases[0].author.login)
            core.setOutput('author_html_url', releases[0].author.html_url)
            core.setOutput('author_type', releases[0].author.type)
            core.setOutput('author_site_admin', releases[0].author.site_admin)
            core.info("Latest release tag: " + releases[0].tag_name)
        } else {
            core.setFailed("No valid releases");
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run()
