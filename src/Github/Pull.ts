import { IGithubUser, IGithubLabel, IGithubMilestone, IGithubCommit } from '.';

export interface IGithubPull {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  merge_commit_sha: string;
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  author_association: string;

  head: IGithubCommit;
  base: IGithubCommit;
  user: IGithubUser;
  labels: IGithubLabel[];
  assignee?: IGithubUser;
  assignees: IGithubUser[];
  requested_reviewers: IGithubUser[];
  milestone?: IGithubMilestone;
}
