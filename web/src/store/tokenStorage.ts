const TOKEN_KEY = "AgroManager:AccessToken";

export const tokenStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  saveToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};
