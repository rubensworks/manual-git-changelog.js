#!/usr/bin/env node
import * as fs from "fs";
import minimist = require('minimist');
import * as io from "../lib/IOUtil";
import * as changelog from "../lib/ChangelogUtil";

async function updateChangelog(init: boolean, previousVersion?: string, newVersion?: string) {
  // If no previous version if provided, define it via the git commits
  if (!previousVersion) {
    previousVersion = await io.getLastGitVersionTag();
  }

  // If we were not able to find a previous version, throw an error (ignore if initializing the changelog)
  if (!init && !previousVersion) {
    throw new Error(`Could not find a valid previous version in the git tags,
did you already run 'manual-git-changelog init'?`);
  }

  // Prepare changelog contents for this version
  const date: string = io.getIsoDate();
  const packageJson: string = await io.getPackageJson();
  if (!newVersion) {
    const lernaJson: string = await io.getLernaJson();
    newVersion = 'v' + changelog.getVersion(lernaJson || packageJson);
  }
  const repoUrl = changelog.getRepoUrl(packageJson);
  const commits: string = changelog.formatCommits(await io.getGitCommits(previousVersion), repoUrl);
  if (!init && newVersion === previousVersion) {
    // Error when the new version is equal to the previous version
    throw new Error(`Found equal new and previous versions ${newVersion},
you may not be running this script in the npm 'version' lifecycle.`);
  }
  const title: string = changelog.getVersionTitle(newVersion, previousVersion, repoUrl, date);
  const versionText: string = changelog.getVersionText(newVersion, title, commits);

  // Let's create or update the changelog
  if (init) {
    // Intialize the changelog if it doesn't exist yet.
    if (fs.existsSync('CHANGELOG.md')) {
      throw new Error(`Could not initialize the changelog as CHANGELOG.md already exists.`);
    }
    const changelogText = `${changelog.getDefaultChangelogHeader()}
${versionText}`;
    // Write to file
    await io.writeFile('CHANGELOG.md', changelogText);
  } else {
    // Insert this version's text into the changelog, right after the header
    const changelogText: string = await io.readFile('CHANGELOG.md', 'utf8');
    const newChangelogText: string = changelog.insertIntoChangelog(changelogText, versionText);

    // Write to file, wait for user input to allow the user to make changes, after which the changelog is staged to git.
    await io.writeFile('CHANGELOG.md', newChangelogText);
    await io.waitForUserInput('Manually edit CHANGELOG.md, press any key to finalize...');
    await io.stageFile('CHANGELOG.md');
  }
}

const args = minimist(process.argv.slice(2));
if (args.h || args.help || (args._.length !== 1 && args._.length !== 2)) {
  console.error(`manual-git-changelog appends to a changelog based on git commits and tags
Usage:
  manual-git-changelog init
  manual-git-changelog v1.2.3
  manual-git-changelog v1.2.2 v1.2.3
  manual-git-changelog onversion 

Options:
  --help        print this help message
`);
  process.exit(1);
}
switch (args._[0]) {
case 'init':
  // Initialize a changelog
  updateChangelog(true);
  break;
case 'onversion':
  // Bump to version from the package.json file
  updateChangelog(false);
  break;
default:
  const versionRange = args._.length > 1;
  updateChangelog(false, versionRange ? args._[0] : null, versionRange ? args._[1] : args._[0]);
  // Bump to version
  break;
}
