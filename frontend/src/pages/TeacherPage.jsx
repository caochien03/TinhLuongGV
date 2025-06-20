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
    DatePicker,
} from "antd";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

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
            fetchData();
            toast.success("Xóa giảng viên thành công!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editing) {
                await axiosClient.put(`/teachers/${editing._id}`, values);
            } else {
                await axiosClient.post("/teachers", values);
            }
            fetchData();
            setModalOpen(false);
            toast.success("Thao tác thành công!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
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
                <Form form={form} layout="vertical" name="teacher_form">
                    <Form.Item
                        name="code"
                        label="Mã Giảng Viên"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã giảng viên!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Họ và Tên"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập họ và tên!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="dob"
                        label="Ngày Sinh"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày sinh!",
                            },
                            {
                                validator: (_, value) => {
                                    if (
                                        value &&
                                        moment().diff(value, "years") < 22
                                    ) {
                                        return Promise.reject(
                                            new Error(
                                                "Giảng viên phải từ 22 tuổi trở lên."
                                            )
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số Điện Thoại"
                        rules={[
                            {
                                pattern: /^\d{10}$/,
                                message: "Số điện thoại phải có 10 chữ số!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: "email",
                                message: "Định dạng email không hợp lệ!",
                            },
                        ]}
                    >
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
