import React from "react";
import { Button, Col, Form, Input, notification, Row } from "antd";
import type { FormProps } from "antd";
import { forgotPasswordApi } from "../../util/api";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface ForgotFormValues {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<ForgotFormValues>["onFinish"] = async (values) => {
    try {
      const { email } = values;
      const res = await forgotPasswordApi(email) as any;
      if (res && (res.EC === 0 || res.success)) {
        notification.success({ message: "Yêu cầu đặt lại mật khẩu", description: res.EM ?? "Vui lòng kiểm tra email để tiếp tục" });
        navigate("/login");
      } else {
        notification.error({ message: "Lỗi", description: res?.EM ?? "Không thể gửi yêu cầu" });
      }
    } catch (error: any) {
      notification.error({ message: "Lỗi", description: error?.message ?? "Lỗi hệ thống" });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, margin: 5, border: "1px solid #ccc", borderRadius: 5 }}>
          <legend>Quên mật khẩu</legend>
          <Form name="forgot" onFinish={onFinish} layout="vertical">
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">Gửi yêu cầu</Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 10 }}>
            <Link to="/login"><ArrowLeftOutlined /> Quay lại đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
