"use client";

import { useState, useEffect } from "react";

export default function useAuth() {
  const default_data = {
    id: 0,
    username: "",
    password: "",
    email: "",
    phone: "",
    verified: false,
    suspended: false,
    forcenewpw: false,
    role: "",
  };
  const [user, setUser] = useState(default_data);

  const getUser = () => {
    const user_string = localStorage.getItem("current_user");
    if (user_string) {
      const user = JSON.parse(user_string || "{}");
      return user;
    } else return default_data;
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  return {
    setUser,
    user,
  };
}
