// tslint:disable:no-var-requires
const getPkgRepo = require('get-pkg-repo');

export function getDefaultChangelogHeader(): string {
  return `# Changelog
All notable changes to this project will be documented in this file.
`;
}

export function getVersion(packageJson: string): string {
  return JSON.parse(packageJson).version;
}

export function getRepoUrl(packageJson: string): string {
  const repoData = getPkgRepo(JSON.parse(packageJson));
  return repoData.browse();
}

export function getCommitUrl(repoUrl: string, hash: string): string {
  return `${repoUrl}/commit/${hash}`;
}

export function getVersionTitle(newVersion: string, previousVersion: string, repoUrl: string, date: string): string {
  return `## [${newVersion}]${previousVersion
    ? `(${repoUrl}/compare/${previousVersion}...${newVersion})` : ''} - ${date}`;
}

export function getVersionText(newVersion: string, title: string, commits: string) {
  return  `<a name="${newVersion}"></a>
${title}

### TODO: categorize commits, choose titles from: Added, Changed, Deprecated, Removed, Fixed, Security.
${commits}
`;
}

export function formatCommits(commits: string[], repoUrl: string): string {
  return commits
    .map((commit: string) => {
      const i = commit.indexOf('-');
      return [commit.substr(0, i), commit.substr(i + 1)];
    })
    .map(([hash, title]: [string, string]) => `* [${title}](${getCommitUrl(repoUrl, hash)})`)
    .join('\n');
}

export function insertIntoChangelog(changelogText: string, versionText: string): string {
  const firstEmptyLineIndex = changelogText.indexOf('\n\n');
  if (firstEmptyLineIndex <= 0) {
    throw new Error(`Found no required empty line in CHANGELOG.md to append into.`);
  }
  return changelogText.substr(0, firstEmptyLineIndex + 2)
    + versionText + '\n' + changelogText.substr(firstEmptyLineIndex + 2);
}
