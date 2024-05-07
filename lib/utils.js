
// loading效果
const ora = require('ora');
const fs = require('fs-extra')
const { encode, decode } = require('ini');

const { configFilePath, defaultConfig } = require('./const');

async function useLoading (fn, msg, ...args) {
  const spinner = ora(msg);
  spinner.start()
  try {
    const res = await fn(...args)
    spinner.succeed()
    return res
  } catch (error) {
    spinner.fail('资源下载失败')
    console.log('错误信息：',error);
    return Promise.reject(error)
  }
}
function queryConfig () {
  let ctx = {}
  if (fs.existsSync(configFilePath)) {
    const content = fs.readFileSync(configFilePath, 'utf8')
    const cObj = decode(content);
    ctx = {
      ...cObj
    }
  } else {
    ctx = {...defaultConfig}
  }
  return ctx;
}
function saveConfig (ctx) {
  fs.writeFileSync(configFilePath, encode(ctx));
}

module.exports = {
  useLoading,
  queryConfig,
  saveConfig,
}