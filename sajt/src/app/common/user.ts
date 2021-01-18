import {Opinion} from "./opinion";

export class User {
  firstName: string;
  lastName: string;
  description: string;
  email: string;
  opinions: Opinion[];
  rating: number;
}
