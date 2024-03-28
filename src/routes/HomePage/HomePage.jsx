import React from 'react';
import { enquireScreen } from 'enquire-js';
import Page2 from './Page';
import './HomePage.css'

let isMobile = false;
enquireScreen((b) => {
  isMobile = b;
});


class HomePage extends React.PureComponent {
  state = {
    isMobile,
    showShadow: false,
  };

  componentDidMount() {
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
  }
  navToShadow = (e) => {
    this.setState({ showShadow: e.mode === 'leave' });
  }
  render() {
    return (
      <div className='container'>
        <img className='logo' src='VTorch.jpg' />
        
        <Page2 className='page' key="page2" isMobile={false} />
      </div>
    );
  }
}
export default HomePage;
