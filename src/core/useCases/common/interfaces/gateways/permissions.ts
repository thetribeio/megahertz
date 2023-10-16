import UserPermissionsProfile from "src/core/useCases/common/permissions/types/userPermissionsProfile";

export default interface PermissionsGatewayInterface {
    getUserPermissions(): Promise<UserPermissionsProfile[]>;
}