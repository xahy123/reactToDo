import React from 'react';
import '../assets/css/index.css';
import Local from  '../common/local'
class List extends React.Component{
	constructor(){
		super()
		this.state = {
			name:'',
			status:1,//切换模式需要的
			beforeTxt:'',//存之前的title，在按esc时取出来
			current:0,//未完成任务总数
			// isEditing:false,//编辑框默认不显示
			list:[]
		}
	}
	//添加任务
  run = (e) => {
    if(e.keyCode === 13){
    	let newList = this.state.list
    	let x = this.state.current
    	x++
    	newList.push({
    		checked:false,
    		title:this.state.name,
    		isEditing:false
    	})
    	this.setState({
  		  list:newList,
  		  current:x
  	  },() => {
  	  	Local.save('List',this.state.list)
  	  })
  	  //存入localstronage中  下面的'List' 可以随便取名，只是浏览器存放localstronage的一个目录
  	  
  	  this.state.name=''
    }
  }
  //页面加载完成后从localstronage中取出来
  componentDidMount(){
  	this.setState({
  		list:Local.get('List'),
  		current:Local.get('List').length
  	})
  }
  
  //计算未完成任务最佳方法
  get num() {
  	let list = this.state.list;
  	// x 就相当于index下标
  	return list.filter(x => !x.checked).length
  	// function(x){
    //   return x.isCompleted;
    // }
    // (x) => return x.isCompleted;
  }

  //给checkbox 双向绑定
  changeList = (key) => {
  	
  	let newList = this.state.list
  	let x = this.state.current
  	newList[key].checked = !newList[key].checked
  	this.setState({
  		list:newList,
  		current:x
  	},() => {
  		Local.save('List',this.state.list)
  	})
  }

  //就是给this.state.name和input双向绑定，
  //不写的话input框就不能输入文字，相当于vue里面的v-model
  add = (ev) => {
    this.setState({
    	name:ev.target.value
    })
  }
  // 删除
  del = (key) => {
  	//let newList = this.state.list.splice(key,1)
  	//  splice返回的是删除的东西，并不是删除之后的东西
  	// console.log(newList)
  	let newList = this.state.list
  	newList.splice(key,1)
  	this.setState({
  		list:newList
  	},()=>{
  		Local.save('List',this.state.list)
  	})

  }
  //双击编辑任务
  dbl = (key) => {
  	let oldTxt = this.state.list[key].title
  	let x = this.state.list
  	x[key].isEditing = true
  	this.setState({
  		list:x,
  		beforeTxt:oldTxt
  	})
  }
  //失去焦点，编辑框消失
  edits = (key) => {
  	let x = this.state.list
  	x[key].isEditing = false
  	this.setState({
  		list:x
  	})
  }
  //获取编辑框的内容
  change = (key,event) => {
  	let x = this.state.list
  	x[key].title = event.target.value
    this.setState({
    	list:x
    })
  }
  end = (key,event) => {
  	if(event.keyCode === 13){
  		let x = this.state.list
  		x[key].isEditing = false
  		this.setState({
  			list:x
  		})
  	}
  	if(event.keyCode === 27){
  		let x = this.state.list
  		x[key].isEditing = false
  	  x[key].title = this.state.beforeTxt
  		this.setState({
  			list:x
  		})
  	}
  }
  //所有任务  未完成的任务 完成的任务之间的切换
  changeStatus = (index) =>{
  	let x = index	
  	this.setState({
  		status:x
  	})
  }
  //筛选列表
  get filterList() {
  	if(this.state.status == 1){
  		return this.state.list
  	}
    if(this.state.status == 2){
    	return this.state.list.filter(x => !x.checked)
    }
    if(this.state.status == 3){
      return this.state.list.filter(x => x.checked)
    }
  }
	render(){
		let newList = this.filterList.map((val,key) => {
			return <li className="todo" key={key} className={this.state.list[key].isEditing ? 'editing' : ''} onDoubleClick={this.dbl.bind(this,key)} onKeyDown={this.end.bind(this,key)}>
                <div className="view">
                  <input type="checkbox" checked={val.checked} onChange={this.changeList.bind(this,key)} className="toggle"/>
                  <label className={val.checked ? 'completed' : ''}>{val.title}</label>
                  <button className="destroy" onClick={this.del.bind(this,key)}></button>
                </div>
                <input type="text" className="edit" onBlur={this.edits.bind(this,key)} value={this.state.list[key].title} onChange={this.change.bind(this,key)} />
              </li>
		})
		return(
			<div>
			  <div className="page-top">
			    <div className="page-content">
			      <h2>任务计划列表</h2>
			    </div>
			  </div>
			  <div className="main" id="app">
			    <h3 className="big-title">添加任务：</h3>
			    <input placeholder="例如：吃饭睡觉打豆豆；    提示：+回车即可添加任务" className="task-input" type="text" value={this.state.name} onChange={this.add} onKeyDown={this.run}/>
			    <ul className="task-count">
            <li>{this.num}个任务未完成</li>
            <li className="action">
              <a href="#" className={this.state.status == 1 ? 'active' : ''} onClick={this.changeStatus.bind(this,1)}>所有任务</a>
              <a href="#" className={this.state.status == 2 ? 'active' : ''} onClick={this.changeStatus.bind(this,2)}>未完成的任务</a>
              <a href="#" className={this.state.status == 3 ? 'active' : ''} onClick={this.changeStatus.bind(this,3)}>完成的任务</a>
            </li>
          </ul>
          <h3 className="big-title">任务列表：</h3>
          <div className="tasks">
            <span className="no-task-tip">还没有添加任何任务</span>
            <ul className="todo-list">
              {newList}
            </ul>
          </div>
			  </div>
			</div>
		)
	}
}

export default List;