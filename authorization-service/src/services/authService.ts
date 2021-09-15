const pipe = (...fns) => value => fns.reduce((result, fn) => fn(result), value);

const conformString = (value: any) => value && typeof value === 'string' ? value : '';
const getToken = (authInfo: string) => authInfo.split(' ')[1];
const atob = (str: string) => Buffer.from(str, 'base64').toString('ascii');
const splitBy = (char: string) => (str: string) => str.split(char);

export class AuthService {

  private getCredentials = pipe(
    conformString,
    getToken,
    atob,
    splitBy(':')
  );

  verifyCredentials(authInfo: string, resource: string) {
    const [name, password] = this.getCredentials(authInfo);

    const effect = process.env.hasOwnProperty(name) && process.env[name] === password
      ? 'Allow'
      : 'Deny';

    return this.generatePolicy(name, effect, resource)
  }

  private generatePolicy(principalId: string, effect: 'Deny' | 'Allow', resource: string) {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }]
      }
    };
  }
}
