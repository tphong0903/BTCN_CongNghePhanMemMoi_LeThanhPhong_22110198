import React, { useEffect, useState } from "react";
import { notification, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getProductApi } from "../../util/api";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchProduct = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const res = await getProductApi(page, limit);

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
    fetchProduct(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Cột hiển thị sản phẩm
  const columns: ColumnsType<IProduct> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Table
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />
    </div>
  );
};

export default ProductPage;
