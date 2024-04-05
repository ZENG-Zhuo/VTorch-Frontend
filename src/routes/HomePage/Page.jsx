import React from 'react';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';
import { Icon } from '@ant-design/compatible';

import Tetris from './technology-comp/Tetris';
import Column from './technology-comp/Column';
import Coordinate from './technology-comp/Coordinate';


const pageData = [
  {
    title: 'DataLoader Design',
    content: 'Design your dataloader to transform the row data into tensor',
    links: [
      <a key="2" href="/modelPage">Design DataLoader<Icon type="right" /></a>,
    ],
    Bg: Tetris,
  },
  {
    title: 'Model Design',
    content: 'Design your model for training',
    links: (<a href="/modelPage">Design your model<Icon type="right" /></a>),
    Bg: Column,
  },
  {
    title: 'Loss Design',
    content: 'Design your loss function to optimize the model',
    links: (<a href="/modelPage">Design your Loss Function<Icon type="right" /></a>),
    Bg: Coordinate,
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
        md: item.full ? 24 : 8, xs: 24,
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
          <OverPack className="page2-content">
            <QueueAnim component={Row} key="queue" type="bottom" leaveReverse>
              {children}
            </QueueAnim>
          </OverPack>
        </div>
      </div>);
  }
}
