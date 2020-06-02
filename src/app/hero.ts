export interface Hero {
  id: number;
  name: string;
  realName? : string;
  thumbnail?: {
    path: string;
    extension: string;
  };
}
