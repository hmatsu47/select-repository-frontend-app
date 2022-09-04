export type ServiceItem = {
  name: string;
};
export type RepositoryItem = {
  name: string;
  uri: string;
};
export type ImageItem = {
  digest: string;
  pushed_at: Date;
  repository_name: string;
  size: number;
  tags?: string[];
  uri: string;
};
export type Setting = {
  image_uri?: string;
  is_released: boolean;
  release_at?: Date;
};
export type ErrorResponse = {
  message: string;
};
