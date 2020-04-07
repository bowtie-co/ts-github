import { Octokit } from '@octokit/rest';
import { requestLog } from '@octokit/plugin-request-log';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import {
  IGithubClient,
  IGithubProps,
  IGithubRepo,
  IGithubIssue,
  IGithubPull,
  IGithubUser,
  IGithubBranch,
  IGithubRepoParams,
  IGithubRepoFilterParams
} from '.';

// https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/master/docs/pulls/updateBranch.md
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

  public async repo(params?: IGithubRepoParams): Promise<IGithubRepo> {
    return await (await this.octokit.repos.get(params)).data;
  }

  public async pull(params?: IGithubRepoParams): Promise<IGithubPull> {}
  public async issue(params?: IGithubRepoParams): Promise<IGithubIssue> {}
  public async branch(params?: IGithubRepoParams): Promise<IGithubBranch> {}
  public async collaborators(): Promise<IGithubUser> {}
  public async contributors(): Promise<IGithubUser> {}

  public async files(): Promise<any> {}
  public async createFile(): Promise<void> {}
  public async deleteFile(): Promise<void> {}
  public async updateFile(): Promise<void> {}
  public async upsertFiles(): Promise<void> {}

  public async _loadPath(options?: any): Promise<any> {}
}
