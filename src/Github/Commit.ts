import { IGithubUser, IGithubRepo } from '.';

export interface IGithubCommit {
  ref: string;
  sha: string;
  url?: string;
  label?: string;
  user?: IGithubUser;
  repo?: IGithubRepo;
}
