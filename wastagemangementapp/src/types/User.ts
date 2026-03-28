export enum Role{
    USER="USER",
    ADMIN="ADMIN",

}
export interface UserResponse{
    id: number;
    username: string;
    email: string;
    district: string;
    role: Role;
}
export interface IUser extends UserResponse{

}

export interface LoginResponseDto {
  token: string;
  username: string;
  role: Role;
}