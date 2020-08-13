import { Octokit } from '@octokit/rest';
import {
  IGithubRepo,
  IGithubIssue,
  IGithubPull,
  IGithubUser,
  IGithubCommit,
  IGithubCommitStatus,
  IGithubContents
} from '.';
import { IGithubBranch } from './Branch';

export interface IGithubProps {
  token?: string;
}

export interface IGithubParams {
  since?: string;
  per_page?: number;
  headers?: { [key: string]: string };
}

export enum GithubRepoVisibility {
  all = 'all',
  public = 'public',
  private = 'private'
}

export enum GithubRepoType {
  all = 'all',
  owner = 'owner',
  member = 'member',
  public = 'public',
  private = 'private'
}

export enum GithubFilterSort {
  full_name = 'full_name',
  created = 'created',
  updated = 'updated',
  pushed = 'pushed'
}

export enum GithubFilterDirection {
  asc = 'asc',
  desc = 'desc'
}

export enum GithubCommitStatus {
  error = 'error',
  pending = 'pending',
  failure = 'failure',
  success = 'success'
}

export enum GithubCommitStatusGroup {
  build = 'build',
  deploy = 'deploy'
}

export interface IGithubCommitStatusSummary {
  [group: string]: IGithubCommitStatus;
}

export interface IGithubRepoFilterParams {
  visibility?: GithubRepoVisibility;
  affiliation?: string;
  type?: GithubRepoType;
  sort?: GithubFilterSort;
  direction?: GithubFilterDirection;
  per_page?: number | string;
}

export interface IGithubRepoParams extends IGithubParams {
  owner: string;
  repo: string;
}

export interface IGithubOrgParams extends IGithubParams {
  org: string;
}

export interface IGithubRepoPullParams extends IGithubRepoParams {
  pull_number: number;
}

export interface IGithubRepoIssueParams extends IGithubRepoParams {
  issue_number: number;
}

export interface IGithubRepoBranchParams extends IGithubRepoParams {
  branch: string;
}

export interface IGithubRepoRefParams extends IGithubRepoParams {
  ref: string;
}

export interface IGithubStatusSummaryParams extends IGithubRepoRefParams {
  only?: GithubCommitStatus;
}

export interface IGithubRepoContentsParams extends IGithubRepoParams {
  path: string;
}

export interface IGithubContentsCommitParams extends IGithubRepoContentsParams {
  message: string;
  branch?: string;
  author?: {
    name: string;
    email: string;
  };
  committer?: {
    name: string;
    email: string;
  };
}

export interface IGithubCreateOrUpdateFileParams extends IGithubContentsCommitParams {
  // Required for Update
  sha?: string;
  content: string;
}

export interface IGithubDeleteFileParams extends IGithubContentsCommitParams {
  sha: string;
}

export interface IGithubCommitResponse {
  commit: IGithubCommit;
  content: null | IGithubContents;
}

export interface IGithubClient {
  octokit: Octokit;
  defaultParams?: IGithubParams;

  user: () => Promise<IGithubUser>;
  repo: (params?: IGithubRepoParams) => Promise<IGithubRepo>;
  repos: (params?: IGithubRepoFilterParams) => Promise<IGithubRepo[]>;
  statuses: (params?: IGithubRepoRefParams) => Promise<IGithubCommitStatus[]>;
  pull: (params?: IGithubRepoPullParams) => Promise<IGithubPull>;
  pulls: (params?: IGithubRepoParams) => Promise<IGithubPull[]>;
  issue: (params?: IGithubRepoIssueParams) => Promise<IGithubIssue>;
  issues: (params?: IGithubRepoParams) => Promise<IGithubIssue[]>;
  branch: (params?: IGithubRepoBranchParams) => Promise<IGithubBranch>;
  branches: (params?: IGithubRepoParams) => Promise<IGithubBranch[]>;
  collaborators: (params?: IGithubRepoParams) => Promise<IGithubUser[]>;
  contributors: (params?: IGithubRepoParams) => Promise<IGithubUser[]>;
  blockedUsers: (params?: IGithubOrgParams) => Promise<IGithubUser[]>;
  orgMembers: (params?: IGithubOrgParams) => Promise<IGithubUser[]>;

  sumStatuses: (params?: IGithubStatusSummaryParams) => Promise<IGithubCommitStatusSummary>;
  iterateRepos: (onPage: (repos: IGithubRepo[]) => void, params?: IGithubRepoFilterParams) => Promise<IGithubRepo[]>;

  getContents: (params?: IGithubRepoContentsParams) => Promise<IGithubContents | IGithubContents[]>;
  createOrUpdateFile: (params?: IGithubCreateOrUpdateFileParams) => Promise<IGithubCommitResponse>;
  deleteFile: (params?: IGithubDeleteFileParams) => Promise<IGithubCommitResponse>;
}
