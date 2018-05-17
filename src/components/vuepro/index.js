const Vuepro = {
  install (Vue, opts) {
    if (this.installed) return

    this.installed = true

    if (opts.transitions) {
      Object.values(opts.transitions).forEach(transition => {
        if (transition.name !== undefined && transition.name.startsWith('v-')) {
          Vue.component(transition.name, transition)
        }
      })
    }

    if (opts.directives) {
      Object.values(opts.directives).forEach(directive => {
        Vue.directive(directive.name, directive)
      })
    }

    if (opts.components) {
      Object.values(opts.components).forEach(component => {
        Vue.use(component)
      })
    }

    if (opts.filters) {
      Object.keys(opts.filters).forEach(key => {
        Vue.filter(key, opts.filters[key])
      })
    }
  }
}

export default Vuepro
