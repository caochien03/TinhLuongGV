import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const columns = [
    { title: "Tên khoa", dataIndex: "name", key: "name" },
    { title: "Tên viết tắt", dataIndex: "shortName", key: "shortName" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
];

const DepartmentPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/departments");
            setData(res.data);
        } catch {
            toast.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/departments/${id}`);
            toast.success(res.data?.message || "Đã xóa");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi xóa";
            toast.error(msg);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let res;
            if (editing) {
                res = await axiosClient.put(
                    `/departments/${editing._id}`,
                    values
                );
                toast.success(res.data?.message || "Đã cập nhật");
            } else {
                res = await axiosClient.post("/departments", values);
                toast.success(res.data?.message || "Đã thêm mới");
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi thao tác";
            toast.error(msg);
        }
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={handleAdd}
                style={{ marginBottom: 16 }}
            >
                Thêm khoa
            </Button>
            <Table
                rowKey="_id"
                columns={[
                    ...columns,
                    {
                        title: "Hành động",
                        key: "action",
                        render: (_, record) => (
                            <>
                                <Button
                                    onClick={() => handleEdit(record)}
                                    style={{ marginRight: 8 }}
                                >
                                    Sửa
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa?"
                                    description="Hành động này không thể hoàn tác."
                                    okText="Xóa"
                                    okType="danger"
                                    cancelText="Hủy"
                                    onConfirm={() => handleDelete(record._id)}
                                >
                                    <Button danger>Xóa</Button>
                                </Popconfirm>
                            </>
                        ),
                    },
                ]}
                dataSource={data}
                loading={loading}
            />
            <Modal
                title={editing ? "Cập nhật khoa" : "Thêm khoa"}
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên khoa"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="shortName"
                        label="Tên viết tắt"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentPage;
