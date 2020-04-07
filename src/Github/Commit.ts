import { IGithubUser, IGithubRepo } from '.';

export interface IGithubCommit {
  sha: string;
  ref?: string;
  url?: string;
  label?: string;
  user?: IGithubUser;
  repo?: IGithubRepo;
}
