import { Octokit } from '@octokit/rest';
import { IGithubRepo, IGithubIssue, IGithubPull, IGithubUser, IGithubCommit, IGithubContents } from '.';
import { IGithubBranch } from './Branch';

export interface IGithubProps {
  token?: string;
}

export interface IGithubParams {
  since?: string;
  per_page?: number;
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

export interface IGithubRepoFilterParams {
  visibility?: GithubRepoVisibility;
  affiliation?: string;
  type?: GithubRepoType;
  sort?: GithubFilterSort;
  direction?: GithubFilterDirection;
}

export interface IGithubRepoParams extends IGithubParams {
  owner: string;
  repo: string;
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

export interface IGithubRepoContentsParams extends IGithubRepoParams {
  path: string;
}

export interface IGithubCreateOrUpdateParams extends IGithubRepoContentsParams {
  message: string;
  content: string;
  // Required for Update
  sha?: string;
  branch?: string;
  author?: {
    name: string;
    email;
  };
  committer?: {
    name: string;
    email;
  };
}

export interface IGithubCreateOrUpdateResponse {
  commit: IGithubCommit;
  content: IGithubContents;
}

export interface IGithubClient {
  octokit: Octokit;
  defaultParams?: IGithubParams;

  user: () => Promise<IGithubUser>;
  repo: (params?: IGithubRepoParams) => Promise<IGithubRepo>;
  repos: (params?: IGithubRepoFilterParams) => Promise<IGithubRepo[]>;
  pull: (params?: IGithubRepoPullParams) => Promise<IGithubPull>;
  pulls: (params?: IGithubRepoParams) => Promise<IGithubPull[]>;
  issue: (params?: IGithubRepoIssueParams) => Promise<IGithubIssue>;
  issues: (params?: IGithubRepoParams) => Promise<IGithubIssue[]>;
  branch: (params?: IGithubRepoBranchParams) => Promise<IGithubBranch>;
  branches: (params?: IGithubRepoParams) => Promise<IGithubBranch[]>;
  collaborators: (params?: IGithubRepoParams) => Promise<IGithubUser>;
  contributors: (params?: IGithubRepoParams) => Promise<IGithubUser>;

  getContents: (params?: IGithubRepoContentsParams) => Promise<IGithubContents | IGithubContents[]>;
  createOrUpdateFile: (params?: IGithubCreateOrUpdateParams) => Promise<IGithubCreateOrUpdateResponse>;
  // deleteFile: () => Promise<void>;
  // updateFile: () => Promise<void>;
  // upsertFiles: () => Promise<void>;

  // _loadPath: (options?: any) => Promise<any>;
}
