import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Button, Spinner } from "reactstrap";
import { DatePicker, message, Card } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import axios from "axios";

const { MonthPicker } = DatePicker;

const ReportDownloader = () => {
    const [fromMonth, setFromMonth] = useState(null);
    const [toMonth, setToMonth] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!fromMonth || !toMonth) {
            message.warning("Please select both From Month and To Month");
            return;
        }

        const from = dayjs(fromMonth).month() + 1; // months are 0-indexed
        const to = dayjs(toMonth).month() + 1;

        if (from > to) {
            message.error("From Month cannot be greater than To Month");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://testpms.ms-tech.in/v15/download-report-bill?from_month=${from}&to_month=${to}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Consumption_Report_${from}_${to}.xlsx`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            message.error("❌ Failed to download report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card
                title="📊 Download Consumption Report"
                bordered={true}
                style={{ maxWidth: 700, margin: "0 auto", borderRadius: "12px" }}
            >
                <Form>
                    <Row className="align-items-center">
                        <Col md={5}>
                            <FormGroup>
                                <Label>From Month</Label>
                                <MonthPicker
                                    style={{ width: "100%" }}
                                    onChange={(value) => setFromMonth(value)}
                                    placeholder="Select From Month"
                                />
                            </FormGroup>
                        </Col>

                        <Col md={5}>
                            <FormGroup>
                                <Label>To Month</Label>
                                <MonthPicker
                                    style={{ width: "100%" }}
                                    onChange={(value) => setToMonth(value)}
                                    placeholder="Select To Month"
                                />
                            </FormGroup>
                        </Col>

                        <Col md={2} className="text-center">
                            <Button
                                color="primary"
                                className="mt-4 w-100"
                                onClick={handleDownload}
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" /> : "Download"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
};

export default ReportDownloader;
