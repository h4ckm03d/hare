import axios from 'axios'
import { saveToken, delToken } from '@/utils/auth'

export const strict = true

export const state = () => ({
  authUser: null,
  locale: null,
  locales: ['zh', 'en'],
  isMenuHidden: false
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  },
  SET_LANG (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  TOGGLE_MENU_HIDDEN: function (state) {
    state.isMenuHidden = !state.isMenuHidden
  }
}

export const getters = {
  authUser (state) {
    return state.authUser
  },
  isMenuHidden (state) {
    return state.isMenuHidden
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {},
  async login ({ commit }, { userName, password, captcha }) {
    try {
      const { data: { access_token: token } } = await axios.post('/hpi/login', {
        userName,
        password,
        captcha
      })
      commit('SET_USER', saveToken(token))
    } catch (error) {
      let message = error.message
      if (error.response.data) {
        message = error.response.data.message || message
      }
      throw new Error(message)
    }
  },
  async logout ({ commit }, callback) {
    await axios.post('/hpi/logout')
    commit('SET_USER', delToken())
    callback()
  },
  toggleMenu ({ commit }) {
    commit('TOGGLE_MENU_HIDDEN')
  }
}
