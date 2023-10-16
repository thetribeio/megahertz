import PermissionsGatewayInterface from "src/core/useCases/common/interfaces/gateways/permissions";
import UserPermissionsProfile from "src/core/useCases/common/permissions/types/userPermissionsProfile";

export default class PermissionsStubGateway implements PermissionsGatewayInterface {
    constructor(permissionsProfileToProvide: UserPermissionsProfile[]) {
    }

    // @ts-ignore
    async getUserPermissions(): Promise<UserPermissionsProfile[]> {
        return [
            {}
        ]
    }

}