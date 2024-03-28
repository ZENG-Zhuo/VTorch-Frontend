import React from 'react';
import { enquireScreen } from 'enquire-js';
import Page2 from './Page';
import './static/style.js';


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
      <Page2 key="page2" isMobile={false} />
    );
  }
}
export default HomePage;
