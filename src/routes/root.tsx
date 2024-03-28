import './root.css'
import { PoweroffOutlined } from '@ant-design/icons';
import { Button, Flex } from "antd";
import React, { useState } from 'react';
import type { FlexProps, SegmentedProps } from 'antd';


const justifyOptions = ['center'];

const alignOptions = ['center'];



export default function Root() {

  const [justify, setJustify] = React.useState<FlexProps['justify']>(justifyOptions[0]);
  const [alignItems, setAlignItems] = React.useState<FlexProps['align']>(alignOptions[0]);

  function gotoModel(){
    window.location.assign("/LoginPage"); 
  } 


  return (
    <div className='contain'>
      <div className="title">
        <h1 className='welcome'> Welcome to </h1>
        <br/><br/>
        <img src='./VTorch.jpg' alt="VtorchLogo" width="800" />
      </div>
      <br/>
      <div className='txtarea'>
        <div> VTorch: a graph-based visual interface for constructing a machine learning program with torch</div>
        <br/>
        <div> Let's start through the button below </div>
      </div>
      <br/><br/>
      <div className='buttons'>
        <Flex justify={justify} gap="large" align={alignItems} wrap="wrap">
          <Button size='large' type='primary' href='/LoginPage' >Login in or register here</Button>
        </Flex>
      </div>
    </div>
  );
}