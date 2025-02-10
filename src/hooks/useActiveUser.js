import { useRole } from "../context/RoleContext";

const useActiveUser = () => {
  const { role } = useRole();

  if (role === btoa("admin")) {
    return btoa("admin");
  } else if (role === btoa("operator")) {
    return btoa("operator");
  }
};

export default useActiveUser;
