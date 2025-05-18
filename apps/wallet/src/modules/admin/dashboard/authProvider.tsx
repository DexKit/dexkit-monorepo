import { getAccessToken, setAccessToken } from '@dexkit/ui/services/auth';

export const AuthProvider = {
  // send username and password to the auth server and get back credentials
  login: async (params: any) => {
    return;
  },

  // wheauthen the dataProvider returns an error, check if this is an ntication error
  checkError: (error: any) => {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      setAccessToken(undefined);
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async (params: any) => {
    const access = await getAccessToken();
    if (access) {
      return;
    }
    return Promise.reject();
  },
  // remove local credentials and notify the auth server that the user logged out
  logout: () => {
    setAccessToken(undefined);
    return Promise.resolve();
  },
  // get the user's profile
  getIdentity: () => Promise.resolve(),
  // get the user permissions (optional)
  getPermissions: () => Promise.resolve(),
};
