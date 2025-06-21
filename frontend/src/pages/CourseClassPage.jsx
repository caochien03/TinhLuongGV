import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Card,
    Row,
    Col,
    Statistic,
    Space,
    Popconfirm,
} from "antd";
import { toast } from "react-toastify";
import { BookOutlined, TeamOutlined } from "@ant-design/icons";
import axiosClient from "../api/axiosClient";

const { Option } = Select;

const CourseClassPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    // State for filters and stats
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [semesterStats, setSemesterStats] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseStats, setCourseStats] = useState(null);
    const [combinedStats, setCombinedStats] = useState(null);

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
            setFilteredData(classesRes.data);
            setCourses(coursesRes.data);
            setSemesters(semestersRes.data);
            setTeachers(teachersRes.data);
        } catch {
            toast.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    const fetchSemesterStats = async () => {
        if (!selectedSemester) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/semester/${selectedSemester}`
            );
            setSemesterStats(res.data);
        } catch {
            toast.error("Lỗi tải thống kê theo kỳ học");
        }
    };

    const fetchCourseStats = async () => {
        if (!selectedCourse) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/course/${selectedCourse}`
            );
            setCourseStats(res.data);
        } catch {
            toast.error("Lỗi tải thống kê theo học phần");
        }
    };

    const fetchCombinedStats = async () => {
        if (!selectedSemester || !selectedCourse) return;
        try {
            const res = await axiosClient.get(
                `/course-classes/stats/semester/${selectedSemester}/course/${selectedCourse}`
            );
            setCombinedStats(res.data);
        } catch {
            toast.error("Lỗi tải thống kê kết hợp");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Effect for semester filter
    useEffect(() => {
        if (selectedSemester && !selectedCourse) {
            fetchSemesterStats();
        } else {
            setSemesterStats(null);
        }
    }, [selectedSemester, selectedCourse]);

    // Effect for course filter
    useEffect(() => {
        if (selectedCourse && !selectedSemester) {
            fetchCourseStats();
        } else {
            setCourseStats(null);
        }
    }, [selectedCourse, selectedSemester]);

    // Effect for combined stats
    useEffect(() => {
        if (selectedSemester && selectedCourse) {
            fetchCombinedStats();
            setSemesterStats(null);
            setCourseStats(null);
        } else {
            setCombinedStats(null);
        }
    }, [selectedSemester, selectedCourse]);

    // Effect for combined filtering
    useEffect(() => {
        let filtered = data;

        if (selectedSemester) {
            filtered = filtered.filter(
                (item) => item.semester?._id === selectedSemester
            );
        }

        if (selectedCourse) {
            filtered = filtered.filter(
                (item) => item.course?._id === selectedCourse
            );
        }

        setFilteredData(filtered);
    }, [selectedSemester, selectedCourse, data]);

    const handleSemesterSelect = (value) => {
        setSelectedSemester(value);
    };

    const handleCourseSelect = (value) => {
        setSelectedCourse(value);
    };

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
            const res = await axiosClient.delete(`/course-classes/${id}`);
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
                    `/course-classes/${editing._id}`,
                    values
                );
                toast.success(res.data?.message || "Đã cập nhật");
            } else {
                res = await axiosClient.post("/course-classes", values);
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
                record.teacher
                    ? `${record.teacher.code} - ${record.teacher.name}`
                    : "Chưa phân công",
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

    const StatCard = ({ title, stats, renderItem }) => (
        <Card title={title}>
            {stats && stats.length > 0 ? (
                stats.map((item, index) => (
                    <Row key={index} gutter={16} style={{ marginBottom: 8 }}>
                        {renderItem(item)}
                    </Row>
                ))
            ) : (
                <p>Không có dữ liệu thống kê.</p>
            )}
        </Card>
    );

    return (
        <div style={{ padding: "24px" }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card title="Thống kê theo Kỳ học">
                        <Select
                            style={{ width: "100%", marginBottom: 16 }}
                            placeholder="Chọn kỳ học"
                            onChange={handleSemesterSelect}
                            value={selectedSemester}
                            allowClear
                        >
                            {semesters.map((sem) => (
                                <Option key={sem._id} value={sem._id}>
                                    {formatSemester(sem)}
                                </Option>
                            ))}
                        </Select>
                        {selectedSemester &&
                            !selectedCourse &&
                            semesterStats && (
                                <StatCard
                                    title={`Chi tiết cho ${
                                        semesters.find(
                                            (s) => s._id === selectedSemester
                                        )?.name
                                    } - ${
                                        semesters.find(
                                            (s) => s._id === selectedSemester
                                        )?.year
                                    }`}
                                    stats={semesterStats}
                                    renderItem={(item) => (
                                        <>
                                            <Col span={12}>
                                                <Statistic
                                                    title={item.courseName}
                                                    value={item.totalClasses}
                                                    prefix={<BookOutlined />}
                                                    suffix="lớp"
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Statistic
                                                    title="Tổng sinh viên"
                                                    value={item.totalStudents}
                                                    prefix={<TeamOutlined />}
                                                />
                                            </Col>
                                        </>
                                    )}
                                />
                            )}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Thống kê theo Học phần">
                        <Select
                            style={{ width: "100%", marginBottom: 16 }}
                            placeholder="Chọn học phần"
                            onChange={handleCourseSelect}
                            value={selectedCourse}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {courses.map((course) => (
                                <Option key={course._id} value={course._id}>
                                    {course.name}
                                </Option>
                            ))}
                        </Select>
                        {selectedCourse && !selectedSemester && courseStats && (
                            <StatCard
                                title={`Chi tiết cho học phần ${
                                    courses.find(
                                        (c) => c._id === selectedCourse
                                    )?.name
                                }`}
                                stats={courseStats}
                                renderItem={(item) => (
                                    <>
                                        <Col span={12}>
                                            <Statistic
                                                title={`${item.semesterName} - ${item.semesterYear}`}
                                                value={item.totalClasses}
                                                prefix={<BookOutlined />}
                                                suffix="lớp"
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic
                                                title="Tổng sinh viên"
                                                value={item.totalStudents}
                                                prefix={<TeamOutlined />}
                                            />
                                        </Col>
                                    </>
                                )}
                            />
                        )}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Thống kê Kết hợp">
                        {selectedSemester && selectedCourse && combinedStats ? (
                            <div>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Tổng số lớp"
                                            value={combinedStats.totalClasses}
                                            prefix={<BookOutlined />}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Tổng sinh viên"
                                            value={combinedStats.totalStudents}
                                            prefix={<TeamOutlined />}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginTop: 16 }}>
                                    <Col span={24}>
                                        <Statistic
                                            title="Trung bình sinh viên/lớp"
                                            value={
                                                combinedStats.avgStudentsPerClass
                                            }
                                            precision={1}
                                        />
                                    </Col>
                                </Row>
                                <div
                                    style={{
                                        marginTop: 16,
                                        fontSize: "12px",
                                        color: "#666",
                                    }}
                                >
                                    <p>
                                        <strong>Học kỳ:</strong>{" "}
                                        {combinedStats.semesterName} -{" "}
                                        {combinedStats.semesterYear}
                                    </p>
                                    <p>
                                        <strong>Học phần:</strong>{" "}
                                        {combinedStats.courseCode} -{" "}
                                        {combinedStats.courseName}
                                    </p>
                                </div>
                            </div>
                        ) : selectedSemester || selectedCourse ? (
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <p>
                                    Chọn cả học kỳ và học phần để xem thống kê
                                    chi tiết
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <p>Chọn ít nhất một tiêu chí để xem thống kê</p>
                            </div>
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
                        dataSource={filteredData}
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
                            <Option value="normal">Thường</Option>
                            <Option value="special">Chất lượng cao</Option>
                            <Option value="international">Quốc tế</Option>
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
