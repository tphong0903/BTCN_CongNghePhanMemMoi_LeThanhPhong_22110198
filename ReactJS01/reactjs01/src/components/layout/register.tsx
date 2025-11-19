import React from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import type { FormProps } from "antd";
import { createUserApi } from "../../util/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<RegisterFormValues>["onFinish"] = async (values) => {
    try {
      const { name, email, password } = values;

      const res = await createUserApi(name, email, password) as unknown as any;

      if (res && res.EC === 0) {
        notification.success({
          message: "CREATE USER",
          description: "Success",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "CREATE USER",
          description: res?.EM ?? "error",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "CREATE USER",
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
          <legend>Đăng Ký Tài Khoản</legend>
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
                { type: "email", message: "Email không hợp lệ" },
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
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <p>
            Bạn đã có tài khoản? <Link to="/login">Đăng Nhập</Link>
          </p>
          <Link to="/">
            <ArrowLeftOutlined /> Quay lại Trang chủ
          </Link>
        </fieldset>
      </Col>
    </Row>
  );
};

export default RegisterPage;