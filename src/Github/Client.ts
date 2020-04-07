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
  IGithubContents,
  IGithubCommitResponse,
  IGithubRepoParams,
  IGithubRepoPullParams,
  IGithubRepoIssueParams,
  IGithubRepoBranchParams,
  IGithubRepoFilterParams,
  IGithubDeleteFileParams,
  IGithubRepoContentsParams,
  IGithubCreateOrUpdateFileParams
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

  // public async get(route: string, params?: IGithubRepoParams): Promise<any> {
  //   return await this.octokit.paginate(`GET /repos/:owner/:repo/${route}`, params || {});
  // }

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

  public async pull(params?: IGithubRepoPullParams): Promise<IGithubPull> {
    return await (await this.octokit.pulls.get(params)).data;
  }
  public async issue(params?: IGithubRepoIssueParams): Promise<IGithubIssue> {
    return await (await this.octokit.issues.get(params)).data;
  }

  public async branch(params?: IGithubRepoBranchParams): Promise<IGithubBranch> {
    return await (await this.octokit.repos.getBranch(params)).data;
  }
  public async collaborators(params?: IGithubRepoParams): Promise<IGithubUser> {
    return await (await this.octokit.collaborators.get(params)).data;
  }
  public async contributors(params?: IGithubRepoParams): Promise<IGithubUser> {
    return await (await this.octokit.contributors.get(params)).data;
  }

  public async getContents(params?: IGithubRepoContentsParams): Promise<IGithubContents | IGithubContents[]> {
    return await (await this.octokit.repos.getContents(params)).data;
  }

  public async createOrUpdateFile(params?: IGithubCreateOrUpdateFileParams): Promise<IGithubCommitResponse> {
    return await (await this.octokit.repos.createOrUpdateFile(params)).data;
  }

  public async deleteFile(params?: IGithubDeleteFileParams): Promise<IGithubCommitResponse> {
    return await (await this.octokit.repos.deleteFile(params)).data;
  }
}
