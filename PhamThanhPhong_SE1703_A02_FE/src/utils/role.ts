export function getRoleName(roleId?: number) {
  switch (roleId) {
    case 1:
      return "staff";
    case 2:
      return "lecturer";
    case 3:
      return "admin";

    default:
      return "guest";
  }
}
