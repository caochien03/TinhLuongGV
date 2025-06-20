import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    message,
    Popconfirm,
} from "antd";
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
        form.setFieldsValue({
            ...record,
            startDate: dayjs(record.startDate),
            endDate: dayjs(record.endDate),
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/semesters/${id}`);
            message.success("Đã xóa");
            fetchData();
        } catch {
            message.error("Lỗi xóa");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Chuyển đổi Dayjs object thành ISO string
            const data = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
            };

            if (editing) {
                await axiosClient.put(`/semesters/${editing._id}`, data);
                message.success("Đã cập nhật");
            } else {
                await axiosClient.post("/semesters", data);
                message.success("Đã thêm mới");
            }
            setModalOpen(false);
            fetchData();
        } catch {
            message.error("Vui lòng kiểm tra lại thông tin");
        }
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
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên kỳ học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên kỳ học",
                            },
                        ]}
                    >
                        <Input placeholder="VD: Học kỳ 1" />
                    </Form.Item>
                    <Form.Item
                        name="year"
                        label="Năm học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập năm học",
                            },
                        ]}
                    >
                        <Input placeholder="VD: 2023-2024" />
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
