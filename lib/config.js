
const chalk = require('chalk')
const { queryConfig, saveConfig } = require('./utils');
const { defaultConfig } = require('./const');
const emitSet = (ctx, key, value) => {
  if (key) {
    ctx[key] = value || ''
  }
  return true
}
const emitGet = (ctx, key) => {
  console.log(`${key}=${chalk.cyan(ctx[key])}`);
}
const emitDelete = (ctx, key) => {
  if (typeof ctx[key] !== 'undefined') {
    delete ctx[key]
    return true
  }
}
const emitShow = (ctx) => {
  Object.keys(ctx).forEach(key => {
    console.log(`${key}=${chalk.cyan(ctx[key] || '')}`);
  })
}
const emitReset = (ctx) => {
  Object.assign(ctx, defaultConfig)
  return true
}

const funs = {
  'set': (ctx, key, value) => {
    return emitSet(ctx,key, value)
  },
  'get': (ctx, key) => {
    return emitGet(ctx,key)
  },
  'delete': (ctx, key) => {
    return emitDelete(ctx,key)
  },
  'show': (ctx) => {
    return emitShow(ctx)
  },
  'reset': (ctx) => {
    return emitReset(ctx)
  }
}
function conf (value, option) {
  // 判断配置文件是否存在
  let ctx = queryConfig()
  // console.log('ctx-start---->', ctx);
  let changeFlag = false;
  // 若存在，将配置文件转化成对象，备用
  Object.keys(funs).forEach(fnKey => {
    if (option[fnKey]) {
      if (option[fnKey] && option[fnKey][0] === '=') {
        option[fnKey] = option[fnKey].slice(1)
      }
      if (funs[fnKey](ctx, option[fnKey], value)) {
        changeFlag = true
      }
    }
  })
  // console.log('ctx-end---->', ctx);
  if (changeFlag) { // 如果配置被改变，则重写配置文件
    saveConfig(ctx)
  }
}
module.exports = conf