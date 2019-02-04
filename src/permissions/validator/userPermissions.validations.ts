
import { PermissionTypes } from '../userPermissions.interface';
export class UserPermissionsValidations {
    public static isPermmision(permmision: PermissionTypes) {
        return ((<any>Object).values(PermissionTypes).indexOf(permmision) !== -1);
    }
}
