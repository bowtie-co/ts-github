import { Octokit } from '@octokit/rest';
import {
  AuthInterface,
  RequestInterface,
  RequestHeaders,
  RequestParameters,
  RequestOptions,
  RequestRequestOptions,
  RequestMethod,
  ResponseHeaders,
  EndpointInterface,
  EndpointOptions,
  OctokitResponse
} from '@octokit/types';
import { requestLog } from '@octokit/plugin-request-log';
import { paginateRest } from '@octokit/plugin-paginate-rest';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

export interface IGitHub {
  octokit: Octokit;
}

export interface IGitHubProps {
  token?: string;
}

export interface IGitHubResource {
  id: number;
  url: string;
}

export interface IGitHubParams {
  // since?: string;
  per_page?: number;
}

export interface IGitHubRepoParams extends IGitHubParams {
  owner: string;
  repo: string;
}

export interface IGitHubIssuesParams extends IGitHubRepoParams {
  since?: string;
}

export class GitHub implements IGitHub {
  public octokit: Octokit;

  constructor(props: IGitHubProps) {
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

  public async issues(params: IGitHubIssuesParams): Promise<any> {
    return await this.octokit.paginate('GET /repos/:owner/:repo/issues', params);
  }

  /**
   * Create a new Jekyll instance for this GitHub connection
   * @param {Object} params - Parameters
   * @param {String} params.owner - Repo owner name
   * @param {String} params.repo - Repo name
   */
  // jekyll (params = {}) {
  //   verifyRequired(params, [ 'owner', 'repo' ])

  //   return new Jekyll(Object.assign({}, params, { github: this }))
  // }

  // /**
  //  * Authorize this GitHub instance
  //  * @param {String} token - GitHub access token
  //  */
  // auth (token) {
  //   if (token) {
  //     this.octokit = new Octokit({ auth: `token ${token}` })
  //   }
  // }

  // /**
  //  * List orgs for authenticated user
  //  * @param {Object} [params] - Additional params (sent to github)
  //  */
  // orgs (params = {}) {
  //   return this._exec('orgs', this.octokit.orgs.listForAuthenticatedUser, params)
  // }

  // /**
  //  * List repos for authenticated user
  //  * @param {Object} [params] - Additional params (sent to github)
  //  */
  // repos (params = {}) {
  //   return this._exec('repos', this.octokit.repos.list, params)
  // }

  // /**
  //  * Get a specific repo
  //  * @param {Object} params - Parameters
  //  * @param {String} params.owner - Repo owner name
  //  * @param {String} params.repo - Repo name
  //  */
  // repo (params = {}) {
  //   verifyRequired(params, [ 'owner', 'repo' ])

  //   return this._exec('repo', this.octokit.repos.get, params)
  // }

  /**
   * Generic exec method for calling octokit methods
   *
   * @param {String} key - Key for exec call (return object key)
   * @param {Function} action - Octokit action to be used
   * @param {Object} [params] - Additional params (sent to github)
   * @returns {Promise<Object>} - Returns promise with response data
   */
  // private _exec (key: string, action: string, params = {}) {
  //   return new Promise(
  //     (resolve, reject) => {
  //       this.logger.info(`Exec github for key: ${key}`)

  //       if (params['per_page'] && params['per_page'].toString() === '0') {
  //         let list = []
  //         let nextPage = '1'
  //         async.whilst(
  //           () => nextPage !== null,
  //           (callback) => {
  //             const actionParams = Object.assign({}, params, { page: nextPage, per_page: '100' })

  //             if (!this.cache) {
  //               Object.assign(actionParams, {
  //                 headers: {
  //                   'If-None-Match': ''
  //                 }
  //               })
  //             }

  //             action(actionParams)
  //               .then(response => {
  //                 const pagination = parse(response.headers.link)
  //                 nextPage = pagination && pagination['next'] ? pagination['next']['page'] : null
  //                 list.push(...response['data'])
  //                 callback(null, list)
  //               })
  //               .catch(callback)
  //           },
  //           (err, n) => {
  //             if (err) {
  //               this.emit('err', err)
  //               reject(err)
  //             } else {
  //               resolve({
  //                 [key]: list,
  //                 pages: null
  //               })
  //             }
  //           }
  //         )
  //       } else {
  //         action(params)
  //           .then(resp => {
  //             resolve({
  //               [key]: resp.data,
  //               pages: parse(resp.headers.link)
  //             })
  //           })
  //           .catch(err => {
  //             this.emit('err', err)
  //             reject(err)
  //           })
  //       }
  //     }
  //   )
  // }
}
