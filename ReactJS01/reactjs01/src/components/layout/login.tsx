import React from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import type { FormProps } from "antd";
import { loginApi } from "../../util/api";
import type { LoginResponse } from "../../util/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/use-auth";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const onFinish: FormProps<LoginFormValues>["onFinish"] = async (values) => {
    try {
      const { email, password } = values;

      const res = await loginApi(email, password) as LoginResponse;

      if (res && res.EC === 0) {
        localStorage.setItem("access_token", res.access_token || "");
        notification.success({
          message: "LOGIN USER",
          description: "Success",
        });
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.user?.email ?? "",
            name: `${res.user?.firstName || ""} ${res.user?.lastName || ""}`.trim(),
          },
        });
        navigate("/");
      } else {
        notification.error({
          message: "LOGIN USER",
          description: res?.EM ?? "error",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "LOGIN USER",
        description: error?.EM ?? error?.message ?? "error",
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đăng Nhập</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: 8 }}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
          <Link to="/">
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký tài đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default LoginPage;