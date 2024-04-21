import React, { useState } from "react";
import "./RegisterPage.css";
import { ExclamationCircleOutlined, GithubOutlined, LoginOutlined } from "@ant-design/icons";
import { LeftOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    Form,
    type FormProps,
    Input,
    FloatButton,
    message,
    Divider,
} from "antd";
import { register } from "../../communication";
import md5 from "md5";

const RegisterPage = () => {
    type FieldType = {
        username?: string;
        password?: string;
        password2?: string;
        remember?: string;
    };

    const [messageApi, contextHolder] = message.useMessage();
    const msgKey = "registerPage";

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
        console.log("Success:", values);
        const username = values.username;
        if (
            values.password2 === values.password &&
            username &&
            values.password
        ) {
            messageApi.open({
                key: msgKey,
                type: "loading",
                content: "Loading...",
            });
            register(username, md5(values.password)).then((r) => {
                if (r.status === 200) {
                    messageApi.open({
                        key: msgKey,
                        type: "success",
                        content: "Success!",
                        duration: 2,
                    });
                } else {
                    messageApi.open({
                        key: msgKey,
                        type: "error",
                        content: "Backend error!",
                        duration: 2,
                    });
                }
            });
        } else {
            messageApi.open({
                key: msgKey,
                type: "error",
                content: "The passwords entered are not identical.",
                duration: 2,
            });
        }
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
        messageApi.open({
            key: msgKey,
            type: "error",
            content: "Oops, there are some errors.",
            duration: 2,
        });
    };

    return (
        <>
            {contextHolder}
            <div className="LoginPage">
                <div className="FormContainer">
                    <div className="title">Register Here</div>
                    <div className="LoginForm">
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your username!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password Again"
                                name="password2"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "two password should be the same",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                name="remember"
                                valuePropName="checked"
                                wrapperCol={{ offset: 8, span: 16 }}
                            >
                                <Checkbox>Auto Login after Register</Checkbox>
                            </Form.Item> 

                                <Button type="primary" htmlType="submit" style={{width:200}}>
                                    {" "}
                                    Register{" "}
                                </Button>
                                <div>
                                    {" "}
                                    <br></br>{" "}
                                </div>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    href="/LoginPage"
                                    style={{width:200}}
                                >
                                    {" "}
                                    Login{" "}
                                </Button>
                        </Form>
                        <Divider plain>
                            <span>contact us</span>
                        </Divider>
                        <a href="https://github.com/ZENG-Zhuo/VTorch-Frontend">
                            <GithubOutlined style={{fontSize:25, verticalAlign:'middle'}} />
                        </a>
                    </div>
                    <FloatButton href="/" icon={<LeftOutlined />} />
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
