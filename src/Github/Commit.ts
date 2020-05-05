import { IGithubUser, IGithubRepo, GithubCommitStatus } from '.';

export interface IGithubCommit {
  sha: string;
  ref?: string;
  url?: string;
  label?: string;
  user?: IGithubUser;
  repo?: IGithubRepo;
}

export interface IGithubCommitStatus {
  id: number;
  node_id: string;
  state: GithubCommitStatus;
  target_url?: string;
  context?: string;
  creator?: IGithubUser;
}
