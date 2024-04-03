import {
  AlipayOutlined,
  GithubOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Page = () => {
  const [loginType, setLoginType] = useState<LoginType>('phone');
  const { token } = theme.useToken();

  function SubmitForm(){
    let username: string = (document.getElementById('FormUsername') as HTMLInputElement).value
    let password: string = (document.getElementById('FormPassword') as HTMLInputElement).value
    console.log(username)
    console.log(password)
  }


  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="LoginBack.png"
        title="VTorch"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle="graph-based visual interface for machine learning program"
        // onClick={SubmitForm}
        
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Divider plain>
              <span
                style={{
                  color: token.colorTextPlaceholder,
                  fontWeight: 'normal',
                  fontSize: 14,
                }}
              >
                Contact us
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid ' + token.colorPrimaryBorder,
                  borderRadius: '50%',
                }}
              >
                <GithubOutlined style={{ ...iconStyles, color: '#1890ff' }} />
              </div>
            </Space>
          </div>
        }
      >
        {(
          <>
            <ProFormText
              name="username"
              className='FormUsername'
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'username'}
              rules={[
                {
                  required: true,
                  message: 'please input your username!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              className='FormPassword'              
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={'prefixIcon'}
                  />
                ),
              }}
              placeholder={'please input your password!'}
              rules={[
                {
                  required: true,
                  message: 'please input your password!',
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};