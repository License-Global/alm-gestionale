import { useRole } from "../context/RoleContext";

const useActiveUser = () => {
  const { role } = useRole();
  

  if (role === 'admin') {
    return "admin";
  } else if (role === 'operator') {
    return "operator";
  }
};

export default useActiveUser;
