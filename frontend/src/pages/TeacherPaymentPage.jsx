import React, { useState, useEffect } from "react";
import { Card, Table, Select, Button, message } from "antd";
import axiosClient from "../api/axiosClient";

const TeacherPaymentPage = () => {
    const [loading, setLoading] = useState(false);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const response = await axiosClient.get("/semesters");
            const data = response.data;
            setSemesters(data);
            if (data.length > 0) {
                setSelectedSemester(data[0]._id);
            }
        } catch {
            message.error("Lỗi tải danh sách kỳ học");
        }
    };

    const fetchPayments = async () => {
        if (!selectedSemester) {
            message.warning("Vui lòng chọn kỳ học");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.get(
                `/payments/calculate-semester/${selectedSemester}`
            );
            const data = response.data;
            setPayments(data);
        } catch (error) {
            console.error("Error fetching payments:", error);
            message.error("Lỗi tải dữ liệu thanh toán");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Mã GV",
            dataIndex: ["teacher", "code"],
            key: "code",
        },
        {
            title: "Tên giảng viên",
            dataIndex: ["teacher", "name"],
            key: "name",
        },
        {
            title: "Tổng số tiết",
            dataIndex: "totalLessons",
            key: "totalLessons",
            align: "right",
        },
        {
            title: "Hệ số bằng cấp",
            dataIndex: "degreeCoefficient",
            key: "degreeCoefficient",
            align: "right",
        },
        {
            title: "Tổng tiền (VNĐ)",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right",
            render: (value) => value?.toLocaleString("vi-VN"),
        },
    ];

    const expandedRowRender = (record) => {
        const detailColumns = [
            {
                title: "Môn học",
                dataIndex: "courseName",
                key: "courseName",
            },
            {
                title: "Số tiết",
                dataIndex: "lessons",
                key: "lessons",
                align: "right",
            },
            {
                title: "Loại lớp",
                dataIndex: "classType",
                key: "classType",
                render: (type) =>
                    ({
                        normal: "Thường",
                        special: "Chất lượng cao",
                        international: "Quốc tế",
                    }[type]),
            },
            {
                title: "Hệ số lớp",
                dataIndex: "classCoefficient",
                key: "classCoefficient",
                align: "right",
            },
            {
                title: "Thành tiền (VNĐ)",
                dataIndex: "amount",
                key: "amount",
                align: "right",
                render: (value) => value?.toLocaleString("vi-VN"),
            },
        ];

        return (
            <Table
                columns={detailColumns}
                dataSource={record.details}
                pagination={false}
                rowKey="courseClass"
            />
        );
    };

    return (
        <div style={{ padding: "24px" }}>
            <Card title="Tính tiền dạy">
                <div style={{ marginBottom: 16 }}>
                    <Select
                        style={{ width: 200, marginRight: 16 }}
                        placeholder="Chọn kỳ học"
                        value={selectedSemester}
                        onChange={setSelectedSemester}
                        options={semesters.map((s) => ({
                            value: s._id,
                            label: `${s.name} - ${s.year}`,
                        }))}
                    />
                    <Button
                        type="primary"
                        onClick={fetchPayments}
                        loading={loading}
                        disabled={!selectedSemester}
                    >
                        Tính toán
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={payments}
                    rowKey={(record) => record.teacher.id}
                    loading={loading}
                    expandable={{
                        expandedRowRender,
                    }}
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default TeacherPaymentPage;
