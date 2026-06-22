# v\-lazyload：惰性组件

自定义指令：惰性组件

惰性组件，指令版

还可以聊高阶组件的实现



# 实现

https://github\.com/hilongjw/vue\-lazyload

- LazyComponent 

```JavaScript
import { inBrowser } from './util'
import Lazy from './lazy'

const LazyComponent = (lazy) => {
  return {
    props: {
      tag: {
        type: String,
        default: 'div'
      }
    },
    render (h) {
      return h(this.tag, null, this.show ? this.$slots.default : null)
    },
    data () {
      return {
        el: null,
        state: {
          loaded: false
        },
        rect: {},
        show: false
      }
    },
    mounted () {
      this.el = this.$el
      lazy.addLazyBox(this)
      lazy.lazyLoadHandler()
    },
    beforeDestroy () {
      lazy.removeComponent(this)
    },
    methods: {
      getRect () {
        this.rect = this.$el.getBoundingClientRect()
      },
      checkInView () {
        this.getRect()
        return inBrowser &&
                    (this.rect.top < window.innerHeight * lazy.options.preLoad && this.rect.bottom > 0) &&
                    (this.rect.left < window.innerWidth * lazy.options.preLoad && this.rect.right > 0)
      },
      load () {
        this.show = true
        this.state.loaded = true
        this.$emit('show', this)
      },
      destroy () {
        return this.$destroy
      }
    }
  }
}

LazyComponent.install = function (Vue, options = {}) {
  const LazyClass = Lazy(Vue)
  const lazy = new LazyClass(options)
  Vue.component('lazy-component', LazyComponent(lazy))
}

export default LazyComponent
```

- LazyImage

```JavaScript
import {
  inBrowser,
  loadImageAsync,
  noop
} from './util'
import Lazy from './lazy'

const LazyImage = (lazyManager) => {
  return {
    props: {
      src: [String, Object],
      tag: {
        type: String,
        default: 'img'
      }
    },
    render (h) {
      return h(this.tag, {
        attrs: {
          src: this.renderSrc
        }
      }, this.$slots.default)
    },
    data () {
      return {
        el: null,
        options: {
          src: '',
          error: '',
          loading: '',
          attempt: lazyManager.options.attempt
        },
        state: {
          loaded: false,
          error: false,
          attempt: 0
        },
        rect: {},
        renderSrc: ''
      }
    },
    watch: {
      src () {
        this.init()
        lazyManager.addLazyBox(this)
        lazyManager.lazyLoadHandler()
      }
    },
    created () {
      this.init()
      this.renderSrc = this.options.loading
    },
    mounted () {
      this.el = this.$el
      lazyManager.addLazyBox(this)
      lazyManager.lazyLoadHandler()
    },
    beforeDestroy () {
      lazyManager.removeComponent(this)
    },
    methods: {
      init () {
        const { src, loading, error } = lazyManager._valueFormatter(this.src)
        this.state.loaded = false
        this.options.src = src
        this.options.error = error
        this.options.loading = loading
        this.renderSrc = this.options.loading
      },
      getRect () {
        this.rect = this.$el.getBoundingClientRect()
      },
      checkInView () {
        this.getRect()
        return inBrowser &&
                    (this.rect.top < window.innerHeight * lazyManager.options.preLoad && this.rect.bottom > 0) &&
                    (this.rect.left < window.innerWidth * lazyManager.options.preLoad && this.rect.right > 0)
      },
      load (onFinish = noop) {
        if ((this.state.attempt > this.options.attempt - 1) && this.state.error) {
          if (!lazyManager.options.silent) console.log(`VueLazyload log: ${this.options.src} tried too more than ${this.options.attempt} times`)
          onFinish()
          return
        }
        const src = this.options.src
        loadImageAsync({ src }, ({ src }) => {
          this.renderSrc = src
          this.state.loaded = true
        }, e => {
          this.state.attempt++
          this.renderSrc = this.options.error
          this.state.error = true
        })
      }
    }
  }
}

LazyImage.install = (Vue, options = {}) => {
  const LazyClass = Lazy(Vue)
  const lazy = new LazyClass(options)
  Vue.component('lazy-image', LazyImage(lazy))
}

export default LazyImage
```

