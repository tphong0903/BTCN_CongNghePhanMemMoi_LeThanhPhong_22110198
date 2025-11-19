import React, { useState } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { MenuClickEventHandler } from "rc-menu/lib/interface";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/use-auth";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  console.log(">>> check auth: ", auth);

  const items = [
    {
      label: <Link to={"/"}>Home Page</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to={"/user"}>Users</Link>,
            key: "user",
            icon: <UsergroupAddOutlined />,
          },
          {
            label: <Link to={"/product"}>Products</Link>,
            key: "product",
            icon: <ShoppingOutlined />,
          },
        ]
      : []),
    {
      label: `Welcome ${auth.user?.email ?? ""}`,
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      setAuth({
                        isAuthenticated: false,
                        user: {
                          email: "",
                          name: "",
                        },
                      });
                      navigate("/login");
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
              },
            ]
          : [
              {
                label: <Link to={"/login"}>Đăng nhập</Link>,
                key: "login",
              },
            ]),
      ],
    },
  ];

  const [current, setCurrent] = useState(() => {
    const pathname = window.location.pathname;
    return pathname.split("/")[1] || "home";
  });

  const onClick: MenuClickEventHandler = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
