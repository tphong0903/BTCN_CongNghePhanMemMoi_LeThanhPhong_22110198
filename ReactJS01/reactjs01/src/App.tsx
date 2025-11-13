import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import type { AxiosError } from "axios";
import { useAuth } from "./components/context/use-auth";
import { Spin } from "antd";


function App() {
  const { setAuth, appLoading, setAppLoading } = useAuth();

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get<any>("/v1/api/account");
        console.log("fetchAccount response:", res);


        const data = (res && res.data) ? res.data : res;

        if (data) {
          const email = data.email ?? data.DT?.email ?? "";
          const name = data.name ?? data.DT?.name ?? email ?? "";
          setAuth({
            isAuthenticated: true,
            user: {
              email,
              name,
            },
          });
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.log("Error fetching user:", axiosError?.message ?? error);
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
      } finally {
        setAppLoading(false);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchAccount();
    } else {
      setAppLoading(false);
    }
  }, [setAuth, setAppLoading]); 

  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;