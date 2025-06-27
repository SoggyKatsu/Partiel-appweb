import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const navigation = useNavigate();

  // allow user register and login
  const allowedPages = ["/home", "/movie/:id"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const currentPath = window.location.pathname;

      // Check if the current path is allowed
      const isAllowed = allowedPages.some((page) => {
        const regex = new RegExp(`^${page.replace(/:\w+/, "\\w+")}$`);
        return regex.test(currentPath);
      });

      if (!isAllowed) {
        navigation("/home");
      }
    } else {
      // If no token, redirect to login
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        navigation("/login");
      }
    }
  }, [navigation]);
};

export default AuthRedirect;
