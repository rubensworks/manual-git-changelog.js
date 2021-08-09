# Manual Git Changelog

[![Build status](https://github.com/rubensworks/manual-git-changelog.js/workflows/CI/badge.svg)](https://github.com/rubensworks/manual-git-changelog.js/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/rubensworks/manual-git-changelog.js/badge.svg?branch=master)](https://coveralls.io/github/rubensworks/manual-git-changelog.js?branch=master)
[![Mutation testing badge](https://badge.stryker-mutator.io/github.com/rubensworks/manual-git-changelog.js/master)](https://stryker-mutator.github.io)
[![npm version](https://badge.fury.io/js/manual-git-changelog.svg)](https://www.npmjs.com/package/manual-git-changelog)

A simple tool for appending to a changelog based on git commits and tags.

This is an alternative to tools such as [conventional-changelog](https://www.npmjs.com/package/conventional-changelog-cli)
for projects that don't follow a specific [commit convention](https://www.conventionalcommits.org/),
but wanting to automate your `CHANGELOG.md` generation upon each release.

This tool does this by automating the creation of `CHANGELOG.md` as much as possible,
but allowing you to manually polish the file before committing.

This tool assumes that you use semantic versioned git tags _(like `v1.2.3` and `v2.0.1`)_.

Some examples of changelogs that were generated with this tool:
* https://github.com/comunica/comunica/blob/master/CHANGELOG.md
* https://github.com/rubensworks/rdf-terms.js/blob/master/CHANGELOG.md

## Installation

It is advised to install this tool as a dev dependency:

```bash
$ yarn add --dev manual-git-changelog
```

## Usage

After installing, the `manual-git-changelog` script will become available.
It can be used to do three things:
1. Initialize a new `CHANGELOG.md` file
2. Add the changelog for an update while [`npm version`](https://docs.npmjs.com/cli/version) is running.
3. Manually add the changelog for a particular version to `CHANGELOG.md`.

These usages will be explained hereafter.

### Initialize

By running `manual-git-changelog init`,
you can create a new `CHANGELOG.md` file
based on your current version and git commits.

This command will fail when `CHANGELOG.md` already exists.

### Automatic version appending

If you like more automation in your release process,
then you can hook this tool into `npm version`.

You can do this by adding the following script to your
`package.json` file:

```json
{
  "scripts": {
    "version": "manual-git-changelog onversion"
  }
}
```

This will make it so that each time you call `npm version`,
the changelog will automatically be updated to the new version.

Note that this will temporarily pause the process
to allow you to manually polish the changelog file,
to allow you to categorize the commits.
This pausing happens when the following is printed to the console

```bash
Manually edit CHANGELOG.md, press any key to finalize...
```

Once you have edited `CHANGELOG.md`, and are satisfied with its structure,
go back to your console, press any key to continue.
The tool will automatically stage `CHANGELOG.md` so that it becomes
part of the version bump commit as done by `npm version`.

### Manual version appending

As an alternative to automatic changelog updates during `npm version`,
you can manually trigger a version log to be added to be added to your changelog.
You can call the command, with a certain version to set as new version _(ex: `v1.2.3`)_ as follows:

```bash
$ manual-git-changelog v1.2.3
```

The previous available version (for example `v1.2.2`) will be automatically
detected from the git tags.
As such, this script assumes that `v1.2.3` has not been tagged yet.

If this version _would_ already be tagged,
then this script also allows you to define a custom version range
that does not try to infer the previous version from the git tags:

```bash
$ manual-git-changelog v1.2.2 v1.2.3
```

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
