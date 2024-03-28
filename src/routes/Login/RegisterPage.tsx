import React, { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, type FormProps, Input, FloatButton, Modal } from 'antd';
import './RegisterPage.css'

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  confirm?:  string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default function RegisterPage(){

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    function OnLoginClick(){
        var pwd1: string = (document.getElementById('RegisterPwd1') as HTMLInputElement).value
        var pwd2: string = (document.getElementById('RegisterPwd2') as HTMLInputElement).value
        console.log(pwd1);
        console.log(pwd2);
        if(pwd1 == pwd2){
            window.location.assign('/');
        } else {
            setIsModalOpen(true);
        }
    }

    return(
        <div>
            <div className='title'>
                Please Register Here :)
            </div>
            <div className='RegisterForm'>
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
                <Input.Password id='RegisterPwd1'/>
                </Form.Item>

                <Form.Item<FieldType>
                label="PasswordAgain"
                name="confirm"
                rules={[{ required: true, message: 'Please input the same password here!' }]}
                >
                <Input.Password id='RegisterPwd2'/>
                </Form.Item>

                <Form.Item<FieldType>
                name="remember"
                valuePropName="checked"
                wrapperCol={{ offset: 8, span: 16 }}
                >
                <Checkbox>automatically login after register</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" onClick={OnLoginClick}> Login  </Button>
                <div> <br></br> </div>
                <Button type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
            <FloatButton href='/' icon={<LeftOutlined/> } />
        </div>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Two Password should be the same</p>
        </Modal>
    </div>
    );
}