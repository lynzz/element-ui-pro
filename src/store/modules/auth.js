import { login, logout } from '../../api/auth'
import store from '@/utils/store'

let userInfo = store.get('userInfo')
const user = {
  state: {
    userName: userInfo ? userInfo.userName : '',
    userCode: userInfo ? userInfo.userCode : '',
    userId: userInfo ? userInfo.userId : '',
    permissions: userInfo ? userInfo.permissions : []
  },

  mutations: {
    setUserName (state, name) {
      state.userName = name
    },

    setUserCode (state, code) {
      state.userCode = code
    },

    setUserId (state, id) {
      state.userId = id
    },

    setPermissions (state, val) {
      state.permissions = val
    }
  },

  actions: {
    login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(data => {
            store.set('userInfo', data)
            store.set('unloginCount', 0)
            commit('setUserName', data.userName)
            commit('setUserCode', data.userCode)
            commit('setUserId', data.userId)
            commit('setPermissions', data.permissions)
            resolve()
          })
          .catch(reason => reject(reason))
      })
    },

    logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          store.clear()
          commit('setUserName', '')
          commit('setUserCode', '')
          commit('setUserId', '')
          commit('setPermissions', '')
          resolve()
        })
      })
    }
  }
}

export default user
