import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
    TeamOutlined,
    BookOutlined,
    ReadOutlined,
    BarChartOutlined,
    BankOutlined,
    ApartmentOutlined,
    FileTextOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: "teacher-management",
            icon: <TeamOutlined />,
            label: "Quản lý giáo viên",
            children: [
                {
                    key: "teachers",
                    icon: <TeamOutlined />,
                    label: "Danh sách giáo viên",
                },
                {
                    key: "departments",
                    icon: <BankOutlined />,
                    label: "Quản lý khoa",
                },
                {
                    key: "degrees",
                    icon: <ApartmentOutlined />,
                    label: "Quản lý bằng cấp",
                },
                {
                    key: "teacher-stats",
                    icon: <BarChartOutlined />,
                    label: "Thống kê giáo viên",
                },
            ],
        },
        {
            key: "course-management",
            icon: <BookOutlined />,
            label: "Quản lý học phần",
            children: [
                {
                    key: "courses",
                    icon: <BookOutlined />,
                    label: "Danh sách học phần",
                },
                {
                    key: "semesters",
                    icon: <BankOutlined />,
                    label: "Quản lý kỳ học",
                },
                {
                    key: "course-classes",
                    icon: <ReadOutlined />,
                    label: "Lớp học phần",
                },
            ],
        },
        {
            key: "payment-management",
            icon: <BarChartOutlined />,
            label: "Tính tiền dạy",
            children: [
                {
                    key: "payment-settings",
                    icon: <BarChartOutlined />,
                    label: "Cài đặt tính tiền",
                },
                {
                    key: "payments",
                    icon: <BarChartOutlined />,
                    label: "Tính tiền giảng viên",
                },
                {
                    key: "reports",
                    icon: <FileTextOutlined />,
                    label: "Báo cáo tiền dạy",
                },
            ],
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(`/${key}`);
    };

    // Tìm selected key dựa trên URL hiện tại
    const selectedKey = location.pathname.split("/")[1] || "teachers";

    return (
        <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            defaultOpenKeys={["teacher-management", "course-management"]}
            items={items}
            onClick={handleMenuClick}
            style={{ height: "100%" }}
        />
    );
};

export default Sidebar;
