import React, { useState, useEffect } from "react";
import {
    Tabs,
    Card,
    Table,
    Statistic,
    Row,
    Col,
    Select,
    Button,
    Spin,
    message,
} from "antd";
import {
    DownloadOutlined,
    BarChartOutlined,
    TeamOutlined,
    BankOutlined,
} from "@ant-design/icons";
import axiosClient from "../api/axiosClient";

const { TabPane } = Tabs;
const { Option } = Select;

const ReportPage = () => {
    const [loading, setLoading] = useState(false);
    const [yearReport, setYearReport] = useState(null);
    const [departmentReport, setDepartmentReport] = useState(null);
    const [schoolReport, setSchoolReport] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    useEffect(() => {
        fetchYears();
        fetchDepartments();
    }, []);

    const fetchYears = async () => {
        try {
            const response = await axiosClient.get("/semesters");
            const uniqueYears = [...new Set(response.data.map((s) => s.year))]
                .sort()
                .reverse();
            setYears(uniqueYears);
            if (uniqueYears.length > 0) {
                setSelectedYear(uniqueYears[0]);
            }
        } catch (error) {
            console.error("Error fetching years:", error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axiosClient.get("/departments");
            setDepartments(response.data);
            if (response.data.length > 0) {
                setSelectedDepartment(response.data[0]._id);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const fetchYearReport = async () => {
        if (!selectedYear) return;

        setLoading(true);
        try {
            const response = await axiosClient.get(
                `/payments/report/year/${selectedYear}`
            );
            setYearReport(response.data);
        } catch (error) {
            message.error("Lỗi khi tải báo cáo năm học");
            console.error("Error fetching year report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentReport = async () => {
        if (!selectedDepartment) return;

        setLoading(true);
        try {
            const url = selectedYear
                ? `/payments/report/department/${selectedDepartment}?year=${selectedYear}`
                : `/payments/report/department/${selectedDepartment}`;
            const response = await axiosClient.get(url);
            setDepartmentReport(response.data);
        } catch (error) {
            message.error("Lỗi khi tải báo cáo khoa");
            console.error("Error fetching department report:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSchoolReport = async () => {
        setLoading(true);
        try {
            const url = selectedYear
                ? `/payments/report/school?year=${selectedYear}`
                : "/payments/report/school";
            const response = await axiosClient.get(url);
            setSchoolReport(response.data);
        } catch (error) {
            message.error("Lỗi khi tải báo cáo toàn trường");
            console.error("Error fetching school report:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const yearReportColumns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "Mã GV",
            dataIndex: ["teacher", "code"],
            key: "code",
            width: 100,
        },
        {
            title: "Họ tên",
            dataIndex: ["teacher", "name"],
            key: "name",
        },
        {
            title: "Khoa",
            dataIndex: ["teacher", "department"],
            key: "department",
        },
        {
            title: "Tổng tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
            width: 100,
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (amount) => formatCurrency(amount),
            width: 150,
        },
    ];

    const departmentReportColumns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "Mã GV",
            dataIndex: ["teacher", "code"],
            key: "code",
            width: 100,
        },
        {
            title: "Họ tên",
            dataIndex: ["teacher", "name"],
            key: "name",
        },
        {
            title: "Tổng tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
            width: 100,
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (amount) => formatCurrency(amount),
            width: 150,
        },
    ];

    const schoolReportColumns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "Khoa",
            dataIndex: ["department", "name"],
            key: "department",
        },
        {
            title: "Số GV",
            dataIndex: "totalTeachers",
            key: "totalTeachers",
            align: "right",
            width: 100,
        },
        {
            title: "Tổng tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
            width: 100,
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (amount) => formatCurrency(amount),
            width: 150,
        },
    ];

    const handleTabChange = (key) => {
        if (key === "1") {
            fetchYearReport();
        } else if (key === "2") {
            fetchDepartmentReport();
        } else if (key === "3") {
            fetchSchoolReport();
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1 style={{ marginBottom: "24px" }}>
                <BarChartOutlined /> Báo cáo tiền dạy
            </h1>

            <Card>
                <Row gutter={16} style={{ marginBottom: "16px" }}>
                    <Col span={8}>
                        <label>Năm học:</label>
                        <Select
                            style={{ width: "100%", marginTop: "4px" }}
                            value={selectedYear}
                            onChange={setSelectedYear}
                            placeholder="Chọn năm học"
                        >
                            <Option value="">Tất cả</Option>
                            {years.map((year) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <label>Khoa:</label>
                        <Select
                            style={{ width: "100%", marginTop: "4px" }}
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            placeholder="Chọn khoa"
                        >
                            {departments.map((dept) => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col
                        span={8}
                        style={{ display: "flex", alignItems: "end" }}
                    >
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() =>
                                message.info(
                                    "Tính năng xuất báo cáo sẽ được phát triển"
                                )
                            }
                        >
                            Xuất báo cáo
                        </Button>
                    </Col>
                </Row>

                <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                    <TabPane
                        tab={
                            <span>
                                <TeamOutlined />
                                Báo cáo theo năm học
                            </span>
                        }
                        key="1"
                    >
                        <Spin spinning={loading}>
                            {yearReport && (
                                <>
                                    <Row
                                        gutter={16}
                                        style={{ marginBottom: "16px" }}
                                    >
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng số giảng viên"
                                                value={yearReport.totalTeachers}
                                                prefix={<TeamOutlined />}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng số tiết"
                                                value={yearReport.totalLessons}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng tiền"
                                                value={yearReport.totalAmount}
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title="Định mức cơ bản"
                                                value={yearReport.baseRate}
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Table
                                        columns={yearReportColumns}
                                        dataSource={yearReport.teachers}
                                        rowKey={(record) => record.teacher.id}
                                        pagination={{
                                            pageSize: 10,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            showTotal: (total, range) =>
                                                `${range[0]}-${range[1]} của ${total} giảng viên`,
                                        }}
                                    />
                                </>
                            )}
                        </Spin>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <BankOutlined />
                                Báo cáo theo khoa
                            </span>
                        }
                        key="2"
                    >
                        <Spin spinning={loading}>
                            {departmentReport && (
                                <>
                                    <Row
                                        gutter={16}
                                        style={{ marginBottom: "16px" }}
                                    >
                                        <Col span={8}>
                                            <Statistic
                                                title="Khoa"
                                                value={
                                                    departmentReport.department
                                                        .name
                                                }
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Tổng số giảng viên"
                                                value={
                                                    departmentReport.totalTeachers
                                                }
                                                prefix={<TeamOutlined />}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Tổng tiền"
                                                value={
                                                    departmentReport.totalAmount
                                                }
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Table
                                        columns={departmentReportColumns}
                                        dataSource={departmentReport.teachers}
                                        rowKey={(record) => record.teacher.id}
                                        pagination={{
                                            pageSize: 10,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            showTotal: (total, range) =>
                                                `${range[0]}-${range[1]} của ${total} giảng viên`,
                                        }}
                                    />
                                </>
                            )}
                        </Spin>
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <BankOutlined />
                                Báo cáo toàn trường
                            </span>
                        }
                        key="3"
                    >
                        <Spin spinning={loading}>
                            {schoolReport && (
                                <>
                                    <Row
                                        gutter={16}
                                        style={{ marginBottom: "16px" }}
                                    >
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng số khoa"
                                                value={
                                                    schoolReport.totalDepartments
                                                }
                                                prefix={<BankOutlined />}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng số giảng viên"
                                                value={
                                                    schoolReport.totalTeachers
                                                }
                                                prefix={<TeamOutlined />}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng số tiết"
                                                value={
                                                    schoolReport.totalLessons
                                                }
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <Statistic
                                                title="Tổng tiền"
                                                value={schoolReport.totalAmount}
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />
                                        </Col>
                                    </Row>
                                    <Table
                                        columns={schoolReportColumns}
                                        dataSource={schoolReport.departments}
                                        rowKey={(record) =>
                                            record.department.id
                                        }
                                        expandable={{
                                            expandedRowRender: (record) => (
                                                <Table
                                                    columns={
                                                        departmentReportColumns
                                                    }
                                                    dataSource={record.teachers}
                                                    rowKey={(teacher) =>
                                                        teacher.teacher.id
                                                    }
                                                    pagination={false}
                                                    size="small"
                                                />
                                            ),
                                        }}
                                        pagination={{
                                            pageSize: 10,
                                            showSizeChanger: true,
                                            showQuickJumper: true,
                                            showTotal: (total, range) =>
                                                `${range[0]}-${range[1]} của ${total} khoa`,
                                        }}
                                    />
                                </>
                            )}
                        </Spin>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default ReportPage;
