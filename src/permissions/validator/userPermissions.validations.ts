
import { PermissionTypes } from '../userPermissions.interface';
export class UserPermissionsValidations {
    public static isPermission(permmision: PermissionTypes) {
        return ((<any>Object).values(PermissionTypes).indexOf(permmision) !== -1);
    }
}
