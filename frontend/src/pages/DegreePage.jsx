import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    InputNumber,
    Space,
    Popconfirm,
} from "antd";
import axiosClient from "../api/axiosClient";

const DegreePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "Tên bằng cấp",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Tên viết tắt",
            dataIndex: "shortName",
            key: "shortName",
        },
        {
            title: "Hệ số",
            dataIndex: "coefficient",
            key: "coefficient",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record)}>
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
                </Space>
            ),
        },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/degrees");
            setData(res.data);
        } catch {
            message.error("Lỗi tải dữ liệu");
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
            await axiosClient.delete(`/degrees/${id}`);
            message.success("Đã xóa");
            fetchData();
        } catch {
            message.error("Lỗi xóa");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editing) {
                await axiosClient.put(`/degrees/${editing._id}`, values);
                message.success("Đã cập nhật");
            } else {
                await axiosClient.post("/degrees", values);
                message.success("Đã thêm mới");
            }
            setModalOpen(false);
            fetchData();
        } catch {
            // Có thể xử lý lỗi nếu muốn
        }
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={handleAdd}
                style={{ marginBottom: 16 }}
            >
                Thêm bằng cấp
            </Button>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data}
                loading={loading}
            />
            <Modal
                title={editing ? "Cập nhật bằng cấp" : "Thêm bằng cấp"}
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên bằng cấp"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên bằng cấp",
                            },
                        ]}
                    >
                        <Input placeholder="VD: Thạc sĩ" />
                    </Form.Item>
                    <Form.Item
                        name="shortName"
                        label="Tên viết tắt"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên viết tắt",
                            },
                        ]}
                    >
                        <Input placeholder="VD: ThS" />
                    </Form.Item>
                    <Form.Item
                        name="coefficient"
                        label="Hệ số bằng cấp"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập hệ số",
                            },
                        ]}
                        initialValue={1}
                    >
                        <InputNumber
                            min={1}
                            step={0.1}
                            style={{ width: "100%" }}
                            placeholder="VD: 1.5"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DegreePage;
