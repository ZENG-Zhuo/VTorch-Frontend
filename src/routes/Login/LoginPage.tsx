import React, {useState} from "react";
import "./LoginPage.css"
import {ExclamationCircleOutlined, LoginOutlined} from "@ant-design/icons";
import { LeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, type FormProps, Input, FloatButton, message } from 'antd';
import { login } from "../../dataCom";
import md5 from "md5";

const LoginPage = () => {

    type FieldType = {
      username?: string;
      password?: string;
      remember?: string;
    };
    const [messageApi, contextHolder] = message.useMessage();
    const msgKey = "loginPage";

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
      console.log('Success:', values);
      const username = values.username;
        if (
            username &&
            values.password
        ) {
            messageApi.open({
                key: msgKey,
                type: "loading",
                content: "Loading...",
            });
            login(username, md5(values.password)).then((r) => {
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

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return(
        <>
        {contextHolder}
        <div className="LoginPage">
        <div className="FormContainer">
        <div className="title" >
                    Login Here
                </div>
                <div className='LoginForm'>
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
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                    >
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" href='/'> Login  </Button>
                    <div> <br></br> </div>
                    <Button type="primary" htmlType="submit" href='/RegisterPage'>Register</Button>
                    </Form.Item>
                </Form>

            </div>
            <FloatButton href='/' icon={<LeftOutlined/> } />
        </div>
        </div>
        </>
    )
}



export default LoginPage;