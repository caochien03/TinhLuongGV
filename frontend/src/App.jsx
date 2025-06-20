import React from "react";
import { Layout } from "antd";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TeacherPage from "./pages/TeacherPage";
import DepartmentPage from "./pages/DepartmentPage";
import DegreePage from "./pages/DegreePage";
import CoursePage from "./pages/CoursePage";
import CourseClassPage from "./pages/CourseClassPage";
import TeacherStatsPage from "./pages/TeacherStatsPage";
import SemesterPage from "./pages/SemesterPage";
import TeacherPaymentPage from "./pages/TeacherPaymentPage";
import PaymentSettingsPage from "./pages/PaymentSettingsPage";
import ReportPage from "./pages/ReportPage";
import "antd/dist/reset.css";

const { Sider, Content } = Layout;

function App() {
    return (
        <Router>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider width={220} style={{ background: "#fff" }}>
                    <Sidebar />
                </Sider>
                <Layout>
                    <Content
                        style={{
                            margin: "24px 16px 0",
                            background: "#fff",
                            padding: 24,
                        }}
                    >
                        <Routes>
                            <Route path="/teachers" element={<TeacherPage />} />
                            <Route
                                path="/departments"
                                element={<DepartmentPage />}
                            />
                            <Route path="/degrees" element={<DegreePage />} />
                            <Route path="/courses" element={<CoursePage />} />
                            <Route
                                path="/course-classes"
                                element={<CourseClassPage />}
                            />
                            <Route
                                path="/teacher-stats"
                                element={<TeacherStatsPage />}
                            />
                            <Route
                                path="/semesters"
                                element={<SemesterPage />}
                            />
                            <Route
                                path="/payments"
                                element={<TeacherPaymentPage />}
                            />
                            <Route
                                path="/payment-settings"
                                element={<PaymentSettingsPage />}
                            />
                            <Route path="/reports" element={<ReportPage />} />
                            <Route
                                path="*"
                                element={<Navigate to="/teachers" />}
                            />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;
