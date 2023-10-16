import PermissionsGatewayInterface from "src/core/useCases/common/interfaces/gateways/permissions";
import UserPermissionsProfile from "src/core/useCases/common/permissions/types/userPermissionsProfile";

export default class PermissionsDenyStubGateway implements PermissionsGatewayInterface {
    // @ts-ignore
    async getUserPermissions(): Promise<UserPermissionsProfile[]> {
        return [];
    }
}