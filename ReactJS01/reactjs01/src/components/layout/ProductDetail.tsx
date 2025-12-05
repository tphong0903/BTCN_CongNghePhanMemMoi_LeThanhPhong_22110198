import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Button,
  Typography,
  Divider,
  Rate,
  Tabs,
  List,
  Avatar,
  Form,
  Input,
  Card,
  notification,
  Tag,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getProductDetailApi,
  getSimilarProductsApi,
  getProductCommentsApi,
  createCommentApi,
  toggleFavoriteApi,
  // toggleFavoriteApi, // Uncomment nếu đã có API này
} from "../../util/api";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Xử lý Lịch sử xem
  useEffect(() => {
    if (product) {
      const viewed = JSON.parse(
        localStorage.getItem("viewed_products") || "[]"
      );
      const newViewed = [
        product,
        ...viewed.filter((p: any) => p.id !== product.id),
      ].slice(0, 10);
      localStorage.setItem("viewed_products", JSON.stringify(newViewed));
    }
  }, [product]);

  const fetchData = async () => {
    if (!id) return;
    try {
      // 1. Get Detail
      const resDetail = await getProductDetailApi(Number(id));
      if (resDetail && resDetail.EC === 0) {
        setProduct(resDetail.data);
        setIsFavorite(resDetail.data.isLiked || false);
      }

      // 2. Get Similar
      const resSimilar = await getSimilarProductsApi(Number(id));
      if (resSimilar && resSimilar.EC === 0)
        setSimilarProducts(resSimilar.data);

      // 3. Get Comments
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    const resComments = await getProductCommentsApi(Number(id));
    if (resComments && resComments.EC === 0) {
      setComments(resComments.data);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const res = await toggleFavoriteApi(Number(id));

      if (res && res.EC === 0) {
        const newStatus = res.data.isLiked;
        setIsFavorite(newStatus);

        notification.success({
          message: newStatus
            ? "Đã thêm vào yêu thích"
            : "Đã xóa khỏi yêu thích",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Lỗi kết nối server" });
    }
  };

  const handleSubmitComment = async (values: any) => {
    if (!id) return;

    try {
      setSubmitting(true);

      const dataPayload = {
        productId: Number(id),
        content: values.content,
        rating: values.rate,
      };

      const res = await createCommentApi(dataPayload);

      if (res && res.EC === 0) {
        notification.success({ message: "Đánh giá thành công!" });
        form.resetFields();
        await fetchComments();
      } else {
        notification.error({
          message: "Lỗi",
          description: res?.EM || "Không thể gửi bình luận",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Lỗi kết nối đến server" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ padding: "30px 100px", background: "#fff" }}>
      {/* --- Phần 1: Thông tin sản phẩm --- */}
      <Row gutter={[32, 32]}>
        <Col span={10}>
          <Image src={product.image} width="100%" />
        </Col>
        <Col span={14}>
          <Title level={2}>{product.productName}</Title>

          <div style={{ marginBottom: 20 }}>
            <Rate disabled defaultValue={4.5} />
            <Text type="secondary" style={{ marginLeft: 10 }}>
              ({comments.length} đánh giá){" "}
              {/* Cập nhật số lượng comment thực tế */}
            </Text>
            <Divider type="vertical" />
            <Text type="secondary">Đã bán: {product.soldCount || 120}</Text>
            <Divider type="vertical" />
            <Text type="secondary">
              <EyeOutlined /> {product.viewCount || 500} lượt xem
            </Text>
          </div>

          <Title level={3} type="danger">
            {product.price?.toLocaleString()} đ
          </Title>

          <Paragraph>
            Thương hiệu: <Tag color="blue">{product.brand}</Tag>
            Danh mục: <Tag color="green">{product.category}</Tag>
          </Paragraph>

          <Paragraph>
            {product.description || "Mô tả sản phẩm đang cập nhật..."}
          </Paragraph>

          <div style={{ marginTop: 30 }}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              style={{ marginRight: 10, width: 200, height: 50 }}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="large"
              icon={
                isFavorite ? (
                  <HeartFilled style={{ color: "red" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={handleToggleFavorite}
              style={{ height: 50 }}
            >
              {isFavorite ? "Đã thích" : "Yêu thích"}
            </Button>
          </div>
        </Col>
      </Row>

      <Divider />

      {/* --- Phần 2: Tab Bình luận & Mô tả chi tiết --- */}
      <Tabs
        defaultActiveKey="2"
        items={[
          {
            key: "1",
            label: "Mô tả chi tiết",
            children: (
              <div
                dangerouslySetInnerHTML={{
                  __html: product.detailDescription || "Nội dung chi tiết...",
                }}
              ></div>
            ),
          },
          {
            key: "2",
            label: `Đánh giá khách hàng (${comments.length})`,
            children: (
              <Row gutter={16}>
                <Col span={16}>
                  <List
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              src={item.avatar} // Nếu API chưa trả về avatar, antd sẽ hiển thị icon User mặc định
                              icon={<UserOutlined />}
                            />
                          }
                          title={
                            <div>
                              {item.username || item.author}{" "}
                              {/* Hiển thị tên từ API */}
                              <Rate
                                disabled
                                defaultValue={item.rating || item.rate} // Mapping field rating
                                style={{ fontSize: 12, marginLeft: 10 }}
                              />
                            </div>
                          }
                          description={
                            <div>
                              <div>{item.content}</div>
                              <div style={{ fontSize: 12, color: "#ccc" }}>
                                {/* Format ngày tháng nếu cần */}
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleString()
                                  : "Vừa xong"}{" "}
                                <CheckCircleOutlined
                                  style={{ color: "green" }}
                                />{" "}
                                Đã mua hàng
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Col>
                <Col span={8}>
                  <Card title="Viết đánh giá của bạn" size="small">
                    <Form
                      form={form} // Gán form instance
                      onFinish={handleSubmitComment}
                      layout="vertical"
                    >
                      <Form.Item name="rate" label="Đánh giá" initialValue={5}>
                        <Rate />
                      </Form.Item>
                      <Form.Item
                        name="content"
                        label="Nội dung"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập nội dung đánh giá",
                          },
                        ]}
                      >
                        <TextArea
                          rows={4}
                          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        />
                      </Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={submitting} // Hiển thị loading khi đang gửi
                      >
                        Gửi đánh giá
                      </Button>
                    </Form>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />

      {/* --- Phần 3: Sản phẩm tương tự --- */}
      <div style={{ marginTop: 50 }}>
        <Title level={4}>Sản phẩm tương tự</Title>
        <Row gutter={[16, 16]}>
          {similarProducts.map((item) => (
            <Col span={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.productName}
                    src={item.image}
                    style={{ height: 150, objectFit: "cover" }}
                  />
                }
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <Card.Meta
                  title={item.productName}
                  description={`${item.price?.toLocaleString()} đ`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* --- Phần 4: Sản phẩm đã xem --- */}
      <div style={{ marginTop: 50 }}>
        <Title level={4}>Sản phẩm bạn đã xem</Title>
        <Row gutter={[16, 16]}>
          {JSON.parse(localStorage.getItem("viewed_products") || "[]").map(
            (item: any) => (
              <Col span={4} key={item.id}>
                <div
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    preview={false}
                    src={item.image}
                    height={100}
                    width={"100%"}
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{ textAlign: "center", fontSize: 12 }}>
                    {item.productName}
                  </div>
                </div>
              </Col>
            )
          )}
        </Row>
      </div>
    </div>
  );
};

export default ProductDetail;
