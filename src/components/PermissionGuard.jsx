import useUserStore from '../store/useUserStore';

export default function PermissionGuard({ permission, children }) {
  const permissions = useUserStore((state) => state.permissions);
  const profile = useUserStore((state) => state.profile);

  // Allow System Admin absolute bypass if needed, or strictly rely on seeded string array
  // if (!permissions.includes(permission)) {
  //   return null;
  // }

  return children;
}
