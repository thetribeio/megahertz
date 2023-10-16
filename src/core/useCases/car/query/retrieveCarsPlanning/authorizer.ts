import UserIsNotAuthorizedToRetrieveCarsPlanningError
    from "src/core/useCases/car/query/retrieveCarsPlanning/exceptions/notAuthorized";
import PermissionsGatewayInterface from "src/core/useCases/common/interfaces/gateways/permissions";
import UserPermissionsProfile from "src/core/useCases/common/permissions/types/userPermissionsProfile";

export default class RetrieveCarsPlanningAuthorizer {
    private readonly permissionsGateway: PermissionsGatewayInterface;

    constructor({permissionsGateway}: { permissionsGateway: PermissionsGatewayInterface }) {
        this.permissionsGateway = permissionsGateway;
    }

    async userMayRetrieveCarsPlanning(): Promise<void> {
        const permissions = await this.permissionsGateway.getUserPermissions();
        if (permissions.length === 0) {
            throw new UserIsNotAuthorizedToRetrieveCarsPlanningError();
        }
    }
}