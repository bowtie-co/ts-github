import { Octokit } from '@octokit/rest';
import { requestLog } from '@octokit/plugin-request-log';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import {
  // interfaces
  IGithubClient,
  IGithubProps,
  IGithubRepo,
  IGithubIssue,
  IGithubPull,
  IGithubUser,
  IGithubBranch,
  IGithubContents,
  IGithubCommitStatus,
  IGithubCommitResponse,
  IGithubCommitStatusSummary,
  IGithubOrgParams,
  IGithubRepoParams,
  IGithubRepoRefParams,
  IGithubRepoPullParams,
  IGithubRepoIssueParams,
  IGithubRepoBranchParams,
  IGithubRepoFilterParams,
  IGithubDeleteFileParams,
  IGithubRepoContentsParams,
  IGithubCreateOrUpdateFileParams,
  // enums
  GithubCommitStatusGroup
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

    // octokit.hook.before("request", async options => {
    //   validate(options);
    // });
    // octokit.hook.after("request", async (response, options) => {
    //   console.log(`${options.method} ${options.url}: ${response.status}`);
    // });
    // octokit.hook.error("request", async (error, options) => {
    //   if (error.status === 304) {
    //     return findInCache(error.headers.etag);
    //   }

    //   throw error;
    // });
    // octokit.hook.wrap("request", async (request, options) => {
    //   // add logic before, after, catch errors or replace the request altogether
    //   return request(options);
    // });
  }

  // public async get(route: string, params?: IGithubRepoParams): Promise<any> {
  //   return await this.octokit.paginate(`GET /repos/:owner/:repo/${route}`, params || {});
  // }

  public async sumStatuses(params?: IGithubRepoRefParams): Promise<IGithubCommitStatusSummary> {
    const result: IGithubCommitStatusSummary = {};
    const statuses: IGithubCommitStatus[] = await this.statuses(params);

    for (const group in GithubCommitStatusGroup) {
      const groupStatus = statuses.find((status) => status.context && status.context.toLowerCase().includes(group));

      if (groupStatus) {
        result[group] = groupStatus;
      }
    }

    return result;
  }

  public async iterateRepos(
    onPage: (repos: IGithubRepo[]) => void,
    params?: IGithubRepoFilterParams
  ): Promise<IGithubRepo[]> {
    let allRepos: IGithubRepo[] = [];

    for await (const response of this.octokit.paginate.iterator<IGithubRepo>('GET /user/repos', params)) {
      onPage(response.data);
      allRepos = allRepos.concat(response.data);
    }

    return allRepos;
  }

  public async user(): Promise<IGithubUser> {
    return await (await this.octokit.users.getAuthenticated()).data;
  }

  public async repos(params?: IGithubRepoFilterParams): Promise<IGithubRepo[]> {
    return await this.octokit.paginate('GET /user/repos', params || {});
  }

  // public async status(params?: IGithubRepoRefParams): Promise<IGithubCommitStatus> {
  //   return await this.octokit.paginate('GET /repos/:owner/:repo/commits/:ref/status', params || {});
  // }

  public async statuses(params?: IGithubRepoRefParams): Promise<IGithubCommitStatus[]> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/commits/:ref/statuses', params || {});
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

  public async collaborators(params?: IGithubRepoParams): Promise<IGithubUser[]> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/collaborators', params || {});
  }

  public async contributors(params?: IGithubRepoParams): Promise<IGithubUser[]> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/contributors', params || {});
  }

  public async blockedUsers(params?: IGithubOrgParams): Promise<IGithubUser[]> {
    return await this.octokit.paginate('GET /orgs/:org/blocks', params || {});
  }

  public async orgMembers(params?: IGithubOrgParams): Promise<IGithubUser[]> {
    return await this.octokit.paginate('GET /orgs/:org/members', params || {});
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

  public async getContents(params?: IGithubRepoContentsParams): Promise<IGithubContents | IGithubContents[]> {
    const headers = {
      'If-None-Match': ''
    };

    return await (await this.octokit.repos.getContents(Object.assign({}, { headers }, params))).data;
  }

  public async createOrUpdateFile(params?: IGithubCreateOrUpdateFileParams): Promise<IGithubCommitResponse> {
    return await (await this.octokit.repos.createOrUpdateFile(params)).data;
  }

  public async deleteFile(params?: IGithubDeleteFileParams): Promise<IGithubCommitResponse> {
    return await (await this.octokit.repos.deleteFile(params)).data;
  }
}
