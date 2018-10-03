import {
  formatCommits,
  getCommitUrl,
  getDefaultChangelogHeader,
  getRepoUrl,
  getVersion,
  getVersionText,
  getVersionTitle,
  insertIntoChangelog,
} from "../lib/ChangelogUtil";

describe('getDefaultChangelogHeader', () => {
  it('should return a header', () => {
    return expect(getDefaultChangelogHeader()).toEqual(`# Changelog
All notable changes to this project will be documented in this file.
`);
  });
});

describe('getVersion', () => {
  it('should return the package.json version when it exists', () => {
    return expect(getVersion('{"version":"1.2.3"}')).toEqual('1.2.3');
  });

  it('should not return the package.json version when it does not exists', () => {
    return expect(getVersion('{}')).toBeFalsy();
  });
});

describe('getRepoUrl', () => {
  it('should return the repo URL if it exists', () => {
    return expect(getRepoUrl('{"repository":"https://github.com/comunica/comunica/"}'))
      .toEqual('https://github.com/comunica/comunica');
  });

  it('should throw an error if no repo URL exists', () => {
    return expect(() => getRepoUrl('{}')).toThrow();
  });
});

describe('getCommitUrl', () => {
  it('should return a commit URL', () => {
    return expect(getCommitUrl('https://github.com/comunica/comunica', 'ABC'))
      .toEqual('https://github.com/comunica/comunica/commit/ABC');
  });
});

describe('getVersionTitle', () => {
  it('should return the title of a version text block with a previous version', () => {
    return expect(getVersionTitle('NEW', 'OLD', 'https://github.com/comunica/comunica', 'NOW'))
      .toEqual('## [NEW](https://github.com/comunica/comunica/compare/OLD...NEW) - NOW');
  });

  it('should return the title of a version text block without a previous version', () => {
    return expect(getVersionTitle('NEW', null, 'https://github.com/comunica/comunica', 'NOW'))
      .toEqual('## [NEW] - NOW');
  });
});

describe('getVersionText', () => {
  it('should return a version text', () => {
    return expect(getVersionText('NEW', 'TITLE', 'COMMITS'))
      .toEqual(`<a name="NEW"></a>
TITLE

### TODO: categorize commits, choose titles from: Added, Changed, Deprecated, Removed, Fixed, Security.
COMMITS
`);
  });
});

describe('formatCommits', () => {
  it('should return formatted commits', () => {
    return expect(formatCommits([
      'H1-T1',
      'H2-T-2',
      'H2-T3---',
    ], 'https://github.com/comunica/comunica')).toEqual(
`* [T1](https://github.com/comunica/comunica/commit/H1)
* [T-2](https://github.com/comunica/comunica/commit/H2)
* [T3---](https://github.com/comunica/comunica/commit/H2)`);
  });
});

describe('insertIntoChangelog', () => {
  it('should return correctly insert a block after the first empty line', () => {
    return expect(insertIntoChangelog(`A
B
C

D
E
F

F
G
H

I
`, `BLOCK
OF
TEXT
`)).toEqual(`A
B
C

BLOCK
OF
TEXT

D
E
F

F
G
H

I
`);
  });

  it('should error when no empty lines are present', () => {
    return expect(() => insertIntoChangelog('a', 'a')).toThrow();
  });
});
