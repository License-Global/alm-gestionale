import { useState, useEffect } from "react";
import useSession from "./useSession";

const useActiveUser = () => {
  const { session } = useSession();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const user = session?.user;
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [session]);

  if (email === process.env.REACT_APP_ADMIN) {
    return "admin";
  } else if (email === process.env.REACT_APP_OPERATOR) {
    return "operator";
  }
};

export default useActiveUser;
