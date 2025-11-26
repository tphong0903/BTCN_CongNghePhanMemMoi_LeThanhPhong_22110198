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
import { getProductApi } from "../../util/api"; // Đảm bảo import đúng

interface IProduct {
  id?: number;
  productName?: string;
  brand?: string;
  category?: string;
  address?: string;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // Filter & Sort State
  const [searchText, setSearchText] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
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

  useEffect(() => {
    fetchProduct();
  }, [currentPage, pageSize, sortBy, sortOrder]);

  const handleTableChange: TableProps<IProduct>["onChange"] = (
    pagination,
    filters,
    sorter: any
  ) => {
    if (pagination.current && pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }

    if (sorter && sorter.field) {
      const order =
        sorter.order === "ascend"
          ? "ASC"
          : sorter.order === "descend"
          ? "DESC"
          : undefined;

      if (order) {
        setSortBy(sorter.field as string);
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
    setTimeout(() => fetchProduct(), 100);
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      sorter: true,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: true,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price) => `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
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
              placeholder="Search by name..."
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
                onClick={handleSearch}
                icon={<SearchOutlined />}
              >
                Search
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
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
          pageSize: pageSize,
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
