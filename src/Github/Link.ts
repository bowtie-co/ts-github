export interface IGithubLink {
  href: string;
}

export interface IGithubLinks {
  [ref: string]: IGithubLink;
}
