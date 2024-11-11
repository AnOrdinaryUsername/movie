export interface MovieInfo {
  id: string;
  genres: Array<Genre>;
  actors_list: Array<Actor>;
  media_title: string;
  media_length: number;
  media_description: string;
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
