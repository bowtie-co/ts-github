import { GithubClient } from '../../src';

describe('GithubClient', () => {
  it('exists', () => {
    expect(GithubClient).toBeDefined();
  });

  it('can be created with empty props', () => {
    const client = new GithubClient({});

    expect(client).toBeDefined();
  });
});
