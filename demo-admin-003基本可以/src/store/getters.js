const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  newaddrouters:state=>state.permissions.newaddrouters,
  newrouters:state=>state.permissions.newrouters,
  stopshow:state=>state.permissions.stopshow,
  alluserinfoone:state=>state.usermessages.alluserinfo,
  totalcountget:state=>state.usermessages.totalcount,
}
export default getters
