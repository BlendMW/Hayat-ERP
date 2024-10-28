declare module 'aws-amplify' {
  export const API: {
    get: (apiName: string, path: string, init?: any) => Promise<any>;
    post: (apiName: string, path: string, init?: any) => Promise<any>;
    put: (apiName: string, path: string, init?: any) => Promise<any>;
    del: (apiName: string, path: string, init?: any) => Promise<any>;
  };
}
