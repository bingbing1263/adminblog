import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  throw new Error('Missing GitHub environment variables');
}

export const octokit = new Octokit({ auth: GITHUB_TOKEN });

export async function getFileContent(path: string) {
  const { data } = await octokit.repos.getContent({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path,
  });
  if ('content' in data && data.content) {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  throw new Error('File not found or invalid content');
}

export async function updateFileContent(path: string, content: string, message: string) {
  // Get the current file SHA
  const { data } = await octokit.repos.getContent({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path,
  });
  if (!('sha' in data)) throw new Error('File SHA not found');
  const sha = data.sha;
  // Update the file
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
  });
}

export async function createFile(path: string, content: string, message: string) {
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER!,
    repo: GITHUB_REPO!,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
  });
} 