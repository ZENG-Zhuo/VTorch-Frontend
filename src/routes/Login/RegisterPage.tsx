import React, {useState} from "react";
import "./RegisterPage.css"
import {ExclamationCircleOutlined, LoginOutlined} from "@ant-design/icons";
import { LeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, type FormProps, Input, FloatButton } from 'antd';

const RegisterPage = () => {

    type FieldType = {
      username?: string;
      password?: string;
      password2?: string;
      remember?: string;
    };

    const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
      console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return(
        <div className="LoginPage">
        <div className="FormContainer">
        <div className="title" >
                    Register Here
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
                    label="Password Again"
                    name="password2"
                    rules={[{ required: true, message: 'two password should be the same' }]}
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

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" href='/HomePage'> Register </Button>
                    <div> <br></br> </div>
                    <Button type="primary" htmlType="submit" href='/LoginPage'> Login </Button>
                    </Form.Item>
                </Form>

            </div>
            <FloatButton href='/' icon={<LeftOutlined/> } />
        </div>
        </div>
    )
}



export default RegisterPage;