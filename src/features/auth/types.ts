export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};
