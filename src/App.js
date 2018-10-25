import React, { Component } from 'react';
import List from './component/List'
//es6 定义构造函数的语法
class App extends Component {
  //jsx语法
  render() {
    return (
      <div>
        <List/>
      </div>
    );
  }
}

export default App;
