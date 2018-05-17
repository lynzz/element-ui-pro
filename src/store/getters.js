const getters = {
  userName: state => state.auth.userName,
  userCode: state => state.auth.userCode,
  userId: state => state.auth.userId,
  permissions: state => state.auth.permissions
}

export default getters
