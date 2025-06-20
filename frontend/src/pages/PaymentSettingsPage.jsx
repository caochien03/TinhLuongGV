import React, { useEffect, useState } from "react";
import { Card, Form, InputNumber, Button, message } from "antd";
import axiosClient from "../api/axiosClient";

const PaymentSettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const fetchSettings = async () => {
        try {
            const response = await axiosClient.get(
                "/payments/settings/payment-rate"
            );
            const baseRate = response.data;
            form.setFieldsValue({ baseRate });
        } catch {
            message.error("Lỗi tải cài đặt");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await axiosClient.put("/payments/settings/payment-rate", values);
            message.success("Đã cập nhật định mức tiền");
            await fetchSettings();
        } catch {
            message.error("Lỗi cập nhật");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "24px" }}>
            <Card title="Cài đặt tính tiền dạy">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            placeholder="VD: 50000"
                            min={0}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PaymentSettingsPage;
