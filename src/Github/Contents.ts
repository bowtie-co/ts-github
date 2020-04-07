import { IGithubCommit } from '.';

export interface IGithubContents extends IGithubCommit {
  name: string;
  path: string;
  type: string;
  size: number;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string | null;
}
