import DialogDrag from './dialog-drag'

export {
  DialogDrag
}

export default function install (Vue) {
  Vue.directive('draggable', DialogDrag)
}
