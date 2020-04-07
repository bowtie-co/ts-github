import { IGithubCommit, IGithubLinks } from '.';

export interface IGithubContents extends IGithubCommit {
  // sha: string;

  name: string;
  path: string;
  type: string;
  size: number;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string | null;

  // _links: IGithubLinks;
}
