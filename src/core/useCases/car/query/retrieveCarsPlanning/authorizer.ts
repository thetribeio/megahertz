import UserIsNotAuthorizedToRetrieveCarsPlanningError
    from "src/core/useCases/car/query/retrieveCarsPlanning/exceptions/notAuthorized";
import PermissionsGatewayInterface from "src/core/useCases/common/interfaces/gateways/permissions";

export default class RetrieveCarsPlanningAuthorizer {
    private readonly permissionsGateway: PermissionsGatewayInterface;

    constructor({permissionsGateway}: { permissionsGateway: PermissionsGatewayInterface }) {
        this.permissionsGateway = permissionsGateway;
    }

    async authorize({actorId}: { actorId: string }): Promise<void> {
        const permissions = await this.permissionsGateway.getUserPermissions({userId: actorId});

        if (permissions.length === 0) {
            throw new UserIsNotAuthorizedToRetrieveCarsPlanningError();
        }
    }
}