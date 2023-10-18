import PermissionsGatewayInterface from "src/core/useCases/common/interfaces/gateways/permissions";
import UserPermissionsProfile from "src/core/useCases/common/permissions/types/userPermissionsProfile";

export default class PermissionsStubGateway implements PermissionsGatewayInterface {
    private readonly permissionsToProvide: UserPermissionsProfile[];

    constructor(permissionsToProvide: UserPermissionsProfile[]) {
        this.permissionsToProvide = permissionsToProvide;
    }

    async getUserPermissions(): Promise<UserPermissionsProfile[]> {
        return this.permissionsToProvide;
    }

}