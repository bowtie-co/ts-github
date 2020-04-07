import { IGithubCommit } from '.';

export interface IGithubBranchProtection {
  enabled: boolean;
}

export interface IGithubBranch {
  name: string;
  commit?: IGithubCommit;
  protected?: boolean;
  protection?: IGithubBranchProtection;
  protection_url?: string;
}
