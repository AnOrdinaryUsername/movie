export interface MovieInfo {
  id: string;
  genres: Array<Genre>;
  actors_list: Array<Actor>;
  media_title: string;
  media_length: number;
  media_description: string;
  media_release_date: string;
  image_url: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Actor {
  id: string;
  name: string;
  birthday: string;
  description: string;
  image_url: string;
}

export interface AccountCreationSuccess {
  id: number;
  email: string;
  username: string;
}

export interface AccountCreationFailure {
  email?: Array<string>;
  username?: Array<string>;
  password?: Array<string>;
}

export type AccountCreation = AccountCreationSuccess | AccountCreationFailure;

export interface LoginToken {
  auth_token: string;
}

export interface LoginFailure {
  non_field_errors?: Array<string>;
  password?: Array<string>;
  username?: Array<string>;
}

export interface User {
  username: string;
  id: number;
}

export interface Review {
  id: string;
  user: User;
  movie: string;
  content: string;
}
