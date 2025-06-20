import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
    TeamOutlined,
    BankOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import axiosClient from "../api/axiosClient";

const TeacherStatsPage = () => {
    const [stats, setStats] = useState({
        totalTeachers: 0,
        teachersByDepartment: [],
        teachersByDegree: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Lấy tất cả giáo viên
                const teachersRes = await axiosClient.get("/teachers");
                const teachers = teachersRes.data;

                // Thống kê theo khoa
                const deptCount = {};
                teachers.forEach((teacher) => {
                    const deptName =
                        teacher.department?.name || "Chưa phân công";
                    deptCount[deptName] = (deptCount[deptName] || 0) + 1;
                });

                // Thống kê theo bằng cấp
                const degreeCount = {};
                teachers.forEach((teacher) => {
                    const degreeName = teacher.degree?.name || "Chưa xác định";
                    degreeCount[degreeName] =
                        (degreeCount[degreeName] || 0) + 1;
                });

                setStats({
                    totalTeachers: teachers.length,
                    teachersByDepartment: Object.entries(deptCount).map(
                        ([name, count]) => ({
                            name,
                            count,
                        })
                    ),
                    teachersByDegree: Object.entries(degreeCount).map(
                        ([name, count]) => ({
                            name,
                            count,
                        })
                    ),
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "24px" }}>Thống kê giáo viên</h2>

            <Card loading={loading}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Statistic
                            title="Tổng số giáo viên"
                            value={stats.totalTeachers}
                            prefix={
                                <TeamOutlined style={{ color: "#1890ff" }} />
                            }
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                <Col xs={24} lg={12}>
                    <Card
                        loading={loading}
                        title={
                            <span>
                                <BankOutlined style={{ marginRight: 8 }} />
                                Thống kê theo khoa
                            </span>
                        }
                        style={{ height: "100%" }}
                    >
                        {stats.teachersByDepartment.map(({ name, count }) => (
                            <Row
                                key={name}
                                style={{
                                    marginBottom: 16,
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                                justify="space-between"
                                align="middle"
                            >
                                <Col>{name}</Col>
                                <Col>
                                    <span
                                        style={{
                                            background: "#1890ff",
                                            color: "white",
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        {count} giáo viên
                                    </span>
                                </Col>
                            </Row>
                        ))}
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        loading={loading}
                        title={
                            <span>
                                <ApartmentOutlined style={{ marginRight: 8 }} />
                                Thống kê theo bằng cấp
                            </span>
                        }
                        style={{ height: "100%" }}
                    >
                        {stats.teachersByDegree.map(({ name, count }) => (
                            <Row
                                key={name}
                                style={{
                                    marginBottom: 16,
                                    padding: "8px 0",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                                justify="space-between"
                                align="middle"
                            >
                                <Col>{name}</Col>
                                <Col>
                                    <span
                                        style={{
                                            background: "#1890ff",
                                            color: "white",
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        {count} giáo viên
                                    </span>
                                </Col>
                            </Row>
                        ))}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default TeacherStatsPage;
