import React, { useEffect, useState } from "react";
import {
    Card,
    Form,
    InputNumber,
    Button,
    Row,
    Col,
    Divider,
    Space,
} from "antd";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const PaymentSettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchSettings = async () => {
        try {
            const response = await axiosClient.get("/settings");
            const settings = response.data;
            form.setFieldsValue({
                baseRate: settings.baseRate,
                normalCoefficient: settings.classCoefficients?.normal || 1.0,
                specialCoefficient: settings.classCoefficients?.special || 1.5,
                internationalCoefficient:
                    settings.classCoefficients?.international || 2.0,
            });
        } catch {
            toast.error("Lỗi tải cài đặt");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const settingsData = {
                baseRate: values.baseRate,
                classCoefficients: {
                    normal: values.normalCoefficient,
                    special: values.specialCoefficient,
                    international: values.internationalCoefficient,
                },
            };
            await axiosClient.put("/settings", settingsData);
            toast.success("Đã cập nhật cài đặt và hệ số lớp học phần");
            await fetchSettings();
        } catch {
            toast.error("Lỗi cập nhật");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "24px" }}>
            <Card title="Cài đặt hệ thống">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="baseRate"
                                label="Định mức tiền theo tiết (VNĐ)"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập định mức tiền",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    formatter={(value) =>
                                        `${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                    }
                                    placeholder="VD: 50000"
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Hệ số lớp học phần</Divider>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="normalCoefficient"
                                label="Lớp thường"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập hệ số",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    step={0.1}
                                    placeholder="VD: 1.0"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="specialCoefficient"
                                label="Lớp chất lượng cao"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập hệ số",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    step={0.1}
                                    placeholder="VD: 1.5"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="internationalCoefficient"
                                label="Lớp quốc tế"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập hệ số",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    min={0}
                                    step={0.1}
                                    placeholder="VD: 2.0"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Cập nhật cài đặt
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PaymentSettingsPage;
