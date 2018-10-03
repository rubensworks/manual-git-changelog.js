import {execFile} from "child_process";
import * as fs from "fs";
import * as readline from "readline";
import {promisify} from "util";
// tslint:disable:no-var-requires
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const gitSemverTags = promisify(require('git-semver-tags'));
const gitRawCommits = require('git-raw-commits');
const arrayifyStream = require('arrayify-stream');

export { readFile, writeFile };

export function getIsoDate(): string {
  return new Date().toISOString().substr(0, 10);
}

export async function getPackageJson(): Promise<string> {
  return await readFile('package.json', 'utf8');
}

export async function getLernaJson(): Promise<string> {
  try {
    return await readFile('lerna.json', 'utf8');
  } catch (e) {
    return null;
  }
}

export async function waitForUserInput(query: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

export async function getLastGitVersionTag(): Promise<string> {
  const tags: string[] = await gitSemverTags();
  if (!tags.length) {
    // Initial release
    return null;
  } else {
    // Not an initial release
    return tags[0];
  }
}

export async function getGitCommits(previousVersion: string): Promise<string[]> {
  return (await arrayifyStream(gitRawCommits({ from: previousVersion, format: '%H-%s' })))
    .map((commit: Buffer) => commit.toString('utf8').replace('\n', ''));
}

export function stageFile(file: string) {
  return new Promise((resolve, reject) => {
    execFile('git', ['add', file], (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}
