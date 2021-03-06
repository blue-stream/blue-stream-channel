export enum PermissionTypes {
    Upload = 'UPLOAD',
    Edit = 'EDIT',
    Remove = 'REMOVE',
    Admin = 'ADMIN',
}
export interface IUserPermissions {
    user: string;
    channel: string;
    permissions: PermissionTypes[];
}
