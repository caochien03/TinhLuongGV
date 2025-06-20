import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Popconfirm,
} from "antd";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const columns = [
    { title: "Mã học phần", dataIndex: "code", key: "code" },
    { title: "Tên học phần", dataIndex: "name", key: "name" },
    { title: "Số tín chỉ", dataIndex: "credits", key: "credits" },
    { title: "Hệ số", dataIndex: "coefficient", key: "coefficient" },
    { title: "Số tiết", dataIndex: "totalLessons", key: "totalLessons" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
];

const CoursePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/courses");
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
            const res = await axiosClient.delete(`/courses/${id}`);
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
                res = await axiosClient.put(`/courses/${editing._id}`, values);
                toast.success(res.data?.message || "Đã cập nhật");
            } else {
                res = await axiosClient.post("/courses", values);
                toast.success(res.data?.message || "Đã thêm mới");
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Vui lòng kiểm tra lại thông tin";
            toast.error(msg);
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <Button
                type="primary"
                onClick={handleAdd}
                style={{ marginBottom: 16 }}
            >
                Thêm học phần
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
                title={editing ? "Cập nhật học phần" : "Thêm học phần"}
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Mã học phần"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã học phần",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên học phần"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên học phần",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="credits"
                        label="Số tín chỉ"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số tín chỉ",
                            },
                        ]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="coefficient"
                        label="Hệ số học phần"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập hệ số học phần",
                            },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            step={0.1}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="totalLessons"
                        label="Số tiết"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số tiết",
                            },
                        ]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CoursePage;
