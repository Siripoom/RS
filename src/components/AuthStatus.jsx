import { useEffect, useState } from "react";
import { supabase } from  "../supabaseClient";

const AuthStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = supabase.auth.user();
    setUser(user);
  }, []);

  return <div>{user ? <p>Welcome {user.email}</p> : <p>Please log in</p>}</div>;
};

export default AuthStatus;
