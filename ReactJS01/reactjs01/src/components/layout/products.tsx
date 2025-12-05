import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Pagination,
  Input,
  Select,
  Rate,
  Spin,
} from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getProductApi } from "../../util/api";

const { Meta } = Card;
const { Search } = Input;

const ProductStore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // Filter States
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); 
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProductApi(
      page,
      pageSize,
      search,
      "",
      "",
      sort,
      "DESC"
    );
    if (res && res.EC === 0) {
      setProducts(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, sort]);

  return (
    <div
      style={{
        padding: "20px 50px",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* --- Filter Bar --- */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          onSearch={(val) => setSearch(val)}
          style={{ width: 300 }}
          enterButton
        />
        <Select
          defaultValue="createdAt"
          style={{ width: 200 }}
          onChange={(val) => setSort(val)}
          options={[
            { value: "createdAt", label: "Mới nhất" },
            { value: "price", label: "Giá" },
            { value: "sold", label: "Bán chạy nhất" },
          ]}
        />
      </div>

      {/* --- Product Grid --- */}
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {products.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={item.productName}
                    src={item.image}
                    style={{ height: 200, objectFit: "cover" }}
                  />
                }
                actions={[
                  <HeartOutlined key="wishlist" />,
                  <ShoppingCartOutlined
                    key="cart"
                    onClick={() => console.log("Add to cart", item)}
                  />,
                ]}
                onClick={() => navigate(`/product/${item.id}`)} // Chuyển sang trang chi tiết
              >
                <Meta
                  title={item.productName}
                  description={
                    <div>
                      <div
                        style={{
                          color: "#d0021b",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        {item.price?.toLocaleString()} đ
                      </div>
                      <div style={{ fontSize: 12, marginTop: 5 }}>
                        <Rate
                          disabled
                          defaultValue={4.5}
                          style={{ fontSize: 12 }}
                        />{" "}
                        | Đã bán: {item.sold || 0}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      {/* --- Pagination --- */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default ProductStore;
