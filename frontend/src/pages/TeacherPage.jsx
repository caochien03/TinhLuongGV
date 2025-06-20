import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Select,
    Popconfirm,
} from "antd";
import axiosClient from "../api/axiosClient";

const columns = [
    { title: "Mã số", dataIndex: "code", key: "code" },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    {
        title: "Ngày sinh",
        dataIndex: "dob",
        key: "dob",
        render: (dob) => dob && dob.slice(0, 10),
    },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
        title: "Khoa",
        dataIndex: "department",
        key: "department",
        render: (dept) => dept?.name || "",
    },
    {
        title: "Bằng cấp",
        dataIndex: "degree",
        key: "degree",
        render: (deg) => deg?.name || "",
    },
];

const TeacherPage = () => {
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/teachers");
            setData(res.data);
        } catch {
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    const fetchDepartments = async () => {
        try {
            const res = await axiosClient.get("/departments");
            setDepartments(res.data);
        } catch {
            message.error("Lỗi tải danh sách khoa");
        }
    };

    const fetchDegrees = async () => {
        try {
            const res = await axiosClient.get("/degrees");
            setDegrees(res.data);
        } catch {
            message.error("Lỗi tải danh sách bằng cấp");
        }
    };

    useEffect(() => {
        fetchData();
        fetchDepartments();
        fetchDegrees();
    }, []);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            dob: record.dob ? record.dob.slice(0, 10) : "",
            department: record.department?._id,
            degree: record.degree?._id,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/teachers/${id}`);
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
                await axiosClient.put(`/teachers/${editing._id}`, values);
                message.success("Đã cập nhật");
            } else {
                await axiosClient.post("/teachers", values);
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
                Thêm giáo viên
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
                title={editing ? "Cập nhật giáo viên" : "Thêm giáo viên"}
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Mã số"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Họ tên"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dob"
                        label="Ngày sinh"
                        rules={[{ required: true }]}
                    >
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="phone" label="Điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label="Khoa"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            {departments.map((dept) => (
                                <Select.Option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="degree"
                        label="Bằng cấp"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            {degrees.map((deg) => (
                                <Select.Option key={deg._id} value={deg._id}>
                                    {deg.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherPage;
