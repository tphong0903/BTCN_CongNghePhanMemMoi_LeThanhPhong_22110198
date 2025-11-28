import React, { useEffect, useState } from "react";
import {
  notification,
  Table,
  Input,
  Button,
  Space,
  Row,
  Col,
  Card,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getProductApi } from "../../util/api";

interface IProduct {
  id?: number;
  productName?: string;
  brand?: string;
  category?: string;
  address?: string;
  price?: number;
  createdAt?: string;
}

const ProductPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductApi(
        currentPage,
        pageSize,
        searchText,
        filterBrand,
        filterCategory,
        sortBy,
        sortOrder
      );

      if (res && res.EC === 0) {
        setDataSource(res.data || []);
        setTotal(res.total || 0);
      } else {
        notification.error({
          message: "ERROR",
          description: res?.EM ?? "Failed to load product",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "ERROR",
        description: error?.message ?? "Failed to load product",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tự động fetch khi thay đổi pagination, sort, search, filter
  useEffect(() => {
    fetchProduct();
  }, [
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    searchText,
    filterBrand,
    filterCategory,
  ]);

  const handleTableChange: TableProps<IProduct>["onChange"] = (
    pagination,
    filters,
    sorter: any
  ) => {
    // Pagination
    if (pagination.current !== currentPage) setCurrentPage(pagination.current!);
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize!);
      setCurrentPage(1);
    }

    // Sort
    if (sorter?.field) {
      const order =
        sorter.order === "ascend"
          ? "ASC"
          : sorter.order === "descend"
          ? "DESC"
          : undefined;

      if (order) {
        setSortBy(sorter.field);
        setSortOrder(order);
      } else {
        setSortBy("createdAt");
        setSortOrder("DESC");
      }
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProduct();
  };

  const handleReset = () => {
    setSearchText("");
    setFilterBrand("");
    setFilterCategory("");
    setSortBy("createdAt");
    setSortOrder("DESC");
    setCurrentPage(1);
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      width: 70,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      sorter: true,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: true,
      render: (price) => `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="Search by Name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
          </Col>

          <Col span={5}>
            <Input
              placeholder="Filter by Brand"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>

          <Col span={5}>
            <Input
              placeholder="Filter by Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>

          <Col span={8} style={{ textAlign: "right" }}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>

              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Table
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
};

export default ProductPage;
