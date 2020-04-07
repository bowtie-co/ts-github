import { Octokit } from '@octokit/rest';
import { requestLog } from '@octokit/plugin-request-log';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import { IGithubRepo, IGithubIssue, IGithubPull, IGithubUser } from '.';
import { IGithubBranch } from './Branch';

export interface IGithubProps {
  token?: string;
}

export interface IGithubResource {
  id: number;
  url: string;
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

  user(): Promise<IGithubUser>;
  repos: (params?: IGithubRepoFilterParams) => Promise<IGithubRepo[]>;
  pulls: (params?: IGithubRepoParams) => Promise<IGithubPull[]>;
  issues: (params?: IGithubRepoParams) => Promise<IGithubIssue[]>;
  branches: (params?: IGithubRepoParams) => Promise<IGithubBranch[]>;
}

export class GithubClient implements IGithubClient {
  public octokit: Octokit;

  constructor(props: IGithubProps) {
    this.auth(props.token);
  }

  public auth(token?: string): void {
    const OctokitPlugins = Octokit.plugin(requestLog).plugin(paginateRest).plugin(restEndpointMethods);

    if (token) {
      this.octokit = new OctokitPlugins({ auth: `token ${token}` });
    } else {
      this.octokit = new OctokitPlugins();
    }
  }

  public async user(): Promise<IGithubUser> {
    return await (await this.octokit.users.getAuthenticated()).data;
  }

  public async repos(params?: IGithubRepoFilterParams): Promise<IGithubRepo[]> {
    return await this.octokit.paginate('GET /user/repos', params || {});
  }

  public async pulls(params?: IGithubRepoParams): Promise<IGithubPull[]> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/pulls', params || {});
  }

  public async issues(params?: IGithubRepoParams): Promise<IGithubIssue[]> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/issues', params || {});
  }

  public async branches(params?: IGithubRepoParams): Promise<IGithubBranch[]> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/branches', params || {});
  }

  public async get(route: string, params?: IGithubRepoParams): Promise<any> {
    return await this.octokit.paginate(`GET /repos/:owner/:repo/${route}`, params || {});
  }
}
