const local = {
  //存
  save(key,val){
    return localStorage.setItem(key,JSON.stringify(val))
  },
  //取
  get(key){
    return JSON.parse(localStorage.getItem(key)) || [];
  }
}

export default local