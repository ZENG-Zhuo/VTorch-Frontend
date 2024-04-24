import React from 'react';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';
import { Icon } from '@ant-design/compatible';

import Tetris from './technology-comp/Tetris';
import Column from './technology-comp/Column';
import Coordinate from './technology-comp/Coordinate';
import Building from './technology-comp/Building';


const pageData = [
  {
    title: 'DataLoader Design',
    content: 'Design your dataloader to transform the row data into tensor',
    links: [
      <a key="2" href="/dataset">Design DataLoader<Icon type="right" /></a>,
    ],
    Bg: Tetris,
  },
  {
    title: 'Model Design',
    content: 'Design your model for training',
    links: (<a href="/modelPage">Design Your Model<Icon type="right" /></a>),
    Bg: Column,
  },
  {
    title: 'User Defined Block',
    content: 'Design your personalized training block',
    links: (<a href="/UDB">Design Your Block<Icon type="right" /></a>),
    Bg: Coordinate,
  },
  {
    title: 'Code Generation',
    content: 'Choose your design and generate the code',
    links: (<a href="/codeGeneration">Generate Your Code<Icon type="right" /></a>),
    Bg: Tetris,
  },
];

export default class Design extends React.PureComponent {
  state = {
    hover: null,
  };
  onMouseEnter = (hover) => {
    this.setState({
      hover,
    });
  }
  onMouseLeave = () => {
    this.setState({
      hover: null,
    });
  }
  render() {
    const { isMobile } = this.props;
    const children = pageData.map((item, i) => {
      const colProps = {
        md: item.full ? 24 : 6, xs: 24,
      };
      return (
        <Col {...colProps} key={i.toString()} className="page2-item-wrapper">
          <div
            className={`page2-item${item.full ? ' full' : ''}`}
            onMouseEnter={() => { this.onMouseEnter(item.title); }}
            onMouseLeave={this.onMouseLeave}
          >
            <div className="page2-item-bg">
              {item.Bg && React.createElement(item.Bg, {
                hover: !isMobile && this.state.hover === item.title,
                isMobile,
              })}
            </div>
            <div className="page2-item-desc">
              <h4>{item.title}</h4>
              <p>{item.content}</p>
              <p className="page2-item-links">
                {item.links}
              </p>
            </div>
          </div>
        </Col>
      );
    });
    return (
      <div className="page-wrapper page2">
        <div className="page">
          <h1>Let's Start Your Journey</h1>
          <br></br>
          <br></br>
          <br></br>
          <i />
          {/* <OverPack className="page2-content"> */}
            <QueueAnim component={Row} key="queue" type="bottom" >
              {children}
            </QueueAnim>
          {/* </OverPack> */}
        </div>
      </div>);
  }
}
