Proxy.prototype = Proxy.prototype || Object.prototype
class Tvue extends Proxy{
    constructor(option) {
        let _container = []
        let data = option.data || {}
        let methods = option.methods || {}
        let _this
        // noinspection JSAnnotator
        super(data, {
            get(target, key) {
                console.log(target, key)
                if (key in target) {
                    return target[key]
                } else {
                    throw Error(`[VUE warn] ${key} is not define` )
                }
            },
            set(target, key, val) {
                target[key] = val
                _container.render(_this)
            }
        })
        // console.log('aaaaaaaaaaa', this);
        _this = this
        _container.$el = document.querySelector(option.el)
        _container.$old_el = _container.$el.cloneNode(true)
        _container.$data = data
        _container.$methods = methods

        _container.render = render.bind(_container)
        _container.render(_this)
    }
}
function render(_this) {
    this.$el.parentNode.replaceChild(this.$old_el, this.$el)
    this.$el =  this.$old_el
    this.$old_el = this.$old_el.cloneNode(true)

    this.$el.innerHTML = this.$el.innerHTML.replace(/\{\{[^\}]+\}\}/g, (str)=> {
        let s = str.substring(2, str.length-2)
        return _eval(s, this.$data)
    })
    let aEle = Array.from(this.$el.getElementsByTagName('*'))
        aEle.push(this.$el)
        // console.log(aEle)
        aEle.forEach(el => {
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith(':')) {
                    let name = attr.name.substring(1)
                    let value = _eval(attr.nodeValue, this.$data)
                    el.removeAttribute(attr.name)
                    el.setAttribute(name, value)
                } else if (attr.name.startsWith('@')) {
                    let name = attr.name.substring(1)
                    let fn = this.$methods[attr.nodeValue]
                    if(!fn) {
                        throw Error('no' + attr.nodeValue + 'function')
                    } else {
                        el.addEventListener(name, fn.bind(_this), false)
                    }
                }
            })
        })
}

function _eval(s, $data){
    s = s.replace(/\w+/g,(s) => {
        return '$data.'+s
    })
    return eval(s)
}
