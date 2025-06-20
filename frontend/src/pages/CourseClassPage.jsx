import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    message,
    Select,
    Card,
    Row,
    Col,
    Statistic,
    Space,
    Popconfirm,
} from "antd";
import { BookOutlined, TeamOutlined } from "@ant-design/icons";
import axiosClient from "../api/axiosClient";

const CourseClassPage = () => {
    const [data, setData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [stats, setStats] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [classesRes, coursesRes, semestersRes, teachersRes] =
                await Promise.all([
                    axiosClient.get("/course-classes"),
                    axiosClient.get("/courses"),
                    axiosClient.get("/semesters"),
                    axiosClient.get("/teachers"),
                ]);

            setData(classesRes.data);
            setCourses(coursesRes.data);
            setSemesters(semestersRes.data);
            setTeachers(teachersRes.data);
        } catch {
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        if (!selectedSemester) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/semester/${selectedSemester}`
            );
            setStats(res.data);
        } catch {
            message.error("Lỗi tải thống kê");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [selectedSemester]);

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            ...record,
            course: record.course?._id,
            semester: record.semester?._id,
            teacher: record.teacher?._id,
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/course-classes/${id}`);
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
                await axiosClient.put(`/course-classes/${editing._id}`, values);
                message.success("Đã cập nhật");
            } else {
                await axiosClient.post("/course-classes", values);
                message.success("Đã thêm mới");
            }
            setModalOpen(false);
            fetchData();
        } catch {
            message.error("Vui lòng kiểm tra lại thông tin");
        }
    };

    const formatSemester = (semester) => {
        if (!semester) return "";
        return `${semester.name} - ${semester.year}`;
    };

    const columns = [
        {
            title: "Mã lớp",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Tên lớp",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Môn học",
            dataIndex: ["course", "name"],
            key: "course",
        },
        {
            title: "Kỳ học",
            dataIndex: ["semester", "name"],
            key: "semester",
            render: (_, record) =>
                `${record.semester.name} - ${record.semester.year}`,
        },
        {
            title: "Giảng viên",
            dataIndex: ["teacher", "name"],
            key: "teacher",
            render: (_, record) =>
                `${record.teacher.code} - ${record.teacher.name}`,
        },
        {
            title: "Loại lớp",
            dataIndex: "type",
            key: "type",
            render: (type) =>
                ({
                    normal: "Thường",
                    special: "Chất lượng cao",
                    international: "Quốc tế",
                }[type]),
        },
        {
            title: "Hệ số",
            dataIndex: "coefficient",
            key: "coefficient",
        },
        {
            title: "Số sinh viên",
            dataIndex: "studentCount",
            key: "studentCount",
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

    return (
        <div style={{ padding: "24px" }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="Thống kê lớp học phần">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Chọn kỳ học để xem thống kê"
                                    onChange={setSelectedSemester}
                                    value={selectedSemester}
                                >
                                    {semesters.map((sem) => (
                                        <Select.Option
                                            key={sem._id}
                                            value={sem._id}
                                        >
                                            {formatSemester(sem)}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                        {stats && (
                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tổng số lớp"
                                            value={stats.reduce(
                                                (sum, item) =>
                                                    sum + item.totalClasses,
                                                0
                                            )}
                                            prefix={<BookOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Statistic
                                            title="Tổng số sinh viên"
                                            value={stats.reduce(
                                                (sum, item) =>
                                                    sum + item.totalStudents,
                                                0
                                            )}
                                            prefix={<TeamOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Button
                        type="primary"
                        onClick={handleAdd}
                        style={{ marginBottom: 16 }}
                    >
                        Thêm lớp học phần
                    </Button>

                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                    />
                </Col>
            </Row>

            <Modal
                title={editing ? "Cập nhật lớp học phần" : "Thêm lớp học phần"}
                open={modalOpen}
                onOk={handleOk}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="code"
                        label="Mã lớp"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mã lớp",
                            },
                        ]}
                    >
                        <Input placeholder="VD: CNTT001" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên lớp"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên lớp",
                            },
                        ]}
                    >
                        <Input placeholder="VD: Lớp 1" />
                    </Form.Item>
                    <Form.Item
                        name="course"
                        label="Môn học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn môn học",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn môn học">
                            {courses.map((course) => (
                                <Select.Option
                                    key={course._id}
                                    value={course._id}
                                >
                                    {course.code} - {course.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="semester"
                        label="Kỳ học"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn kỳ học",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn kỳ học">
                            {semesters.map((semester) => (
                                <Select.Option
                                    key={semester._id}
                                    value={semester._id}
                                >
                                    {semester.name} - {semester.year}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="teacher"
                        label="Giảng viên"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn giảng viên",
                            },
                        ]}
                    >
                        <Select placeholder="Chọn giảng viên">
                            {teachers.map((teacher) => (
                                <Select.Option
                                    key={teacher._id}
                                    value={teacher._id}
                                >
                                    {teacher.code} - {teacher.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="Loại lớp"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn loại lớp",
                            },
                        ]}
                        initialValue="normal"
                    >
                        <Select>
                            <Select.Option value="normal">Thường</Select.Option>
                            <Select.Option value="special">
                                Chất lượng cao
                            </Select.Option>
                            <Select.Option value="international">
                                Quốc tế
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="coefficient"
                        label="Hệ số lớp"
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
                            placeholder="VD: 1.2"
                        />
                    </Form.Item>
                    <Form.Item
                        name="studentCount"
                        label="Số lượng sinh viên"
                        initialValue={0}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="VD: 50"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CourseClassPage;
