import { Octokit } from '@octokit/rest';
import { IGithubRepo, IGithubIssue, IGithubPull, IGithubUser } from '.';
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

export interface IGithubClient {
  octokit: Octokit;
  defaultParams?: IGithubParams;

  user: () => Promise<IGithubUser>;
  repo: (params?: IGithubRepoParams) => Promise<IGithubRepo>;
  repos: (params?: IGithubRepoFilterParams) => Promise<IGithubRepo[]>;
  pull: (params?: IGithubRepoParams) => Promise<IGithubPull>;
  pulls: (params?: IGithubRepoParams) => Promise<IGithubPull[]>;
  issue: (params?: IGithubRepoParams) => Promise<IGithubIssue>;
  issues: (params?: IGithubRepoParams) => Promise<IGithubIssue[]>;
  branch: (params?: IGithubRepoParams) => Promise<IGithubBranch>;
  branches: (params?: IGithubRepoParams) => Promise<IGithubBranch[]>;
  collaborators: () => Promise<IGithubUser>;
  contributors: () => Promise<IGithubUser>;

  files: () => Promise<any>;
  createFile: () => Promise<void>;
  deleteFile: () => Promise<void>;
  updateFile: () => Promise<void>;
  upsertFiles: () => Promise<void>;

  _loadPath: (options?: any) => Promise<any>;
}
