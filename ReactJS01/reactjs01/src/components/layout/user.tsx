import React, { useEffect, useState } from "react";
import { notification, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { getUserApi } from "../../util/api";

interface IUser {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  image?: string;
  roleId?: string;
  positionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserApi() as unknown as IUser[];
        if (res && Array.isArray(res)) {
          setDataSource(res);
        } else {
          notification.error({
            message: "Unauthorized",
            description: "Failed to load users",
          });
        }
      } catch (error: any) {
        notification.error({
          message: "Unauthorized",
          description: error?.EM ?? error?.message ?? "Error loading users",
        });
      }
    };
    fetchUser();
  }, []);

  const columns: ColumnsType<IUser> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <Table bordered dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  );
};

export default UserPage;