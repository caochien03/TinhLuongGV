import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Popconfirm,
    Select,
} from "antd";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import dayjs from "dayjs";

const columns = [
    { title: "Tên kỳ học", dataIndex: "name", key: "name" },
    { title: "Năm học", dataIndex: "year", key: "year" },
    {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        key: "startDate",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
        title: "Ngày kết thúc",
        dataIndex: "endDate",
        key: "endDate",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
];

const SemesterPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/semesters");
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
        form.setFieldsValue({
            ...record,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axiosClient.delete(`/semesters/${id}`);
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
            if (editing) {
                await axiosClient.put(`/semesters/${editing._id}`, values);
                toast.success("Cập nhật học kỳ thành công!");
            } else {
                await axiosClient.post("/semesters", values);
                toast.success("Thêm học kỳ thành công!");
            }
            fetchData();
            setModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Thao tác thất bại");
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    const validateEndDate = (_, value) => {
        const startDate = form.getFieldValue("startDate");
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
        }
        return Promise.resolve();
    };

    return (
        <div style={{ padding: "24px" }}>
            <Button
                type="primary"
                onClick={handleAdd}
                style={{ marginBottom: 16 }}
            >
                Thêm kỳ học
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
                title={editing ? "Cập nhật kỳ học" : "Thêm kỳ học"}
                open={modalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" name="semester_form">
                    <Form.Item
                        name="name"
                        label="Tên Học Kỳ"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn tên học kỳ!",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn học kỳ">
                            <Select.Option value="Học kì 1">
                                Học kì 1
                            </Select.Option>
                            <Select.Option value="Học kì 2">
                                Học kì 2
                            </Select.Option>
                            <Select.Option value="Học kì 3">
                                Học kì 3
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="year"
                        label="Năm Học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập năm học!",
                            },
                            {
                                pattern: /^(\d{4})-(\d{4})$/,
                                message: "Định dạng năm học phải là YYYY-YYYY.",
                            },
                            {
                                validator: (_, value) => {
                                    if (value) {
                                        const [startYear, endYear] = value
                                            .split("-")
                                            .map(Number);
                                        if (endYear !== startYear + 1) {
                                            return Promise.reject(
                                                new Error(
                                                    "Năm kết thúc phải lớn hơn năm bắt đầu 1 năm."
                                                )
                                            );
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input placeholder="Ví dụ: 2023-2024" />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày bắt đầu",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày bắt đầu"
                        />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="Ngày kết thúc"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày kết thúc",
                            },
                            { validator: validateEndDate },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày kết thúc"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SemesterPage;
