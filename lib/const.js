// 配置文件的存储位置
const configFilePath = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.niurc`;
// 默认拉取的仓库名组织名称
const defaultConfig = {
  type: 'github', // github gitee gitlab
  org: 'niu-fly',
  mode: 'branches', // tags、branches
  giteeToken: '', // giteeToken
  gitlabToken: '', // gitlabToken
  gitlabDomain: '', // gitlabDomain
  gitlabGroupId: '', // gitlabGroupId
};
module.exports = {
  configFilePath,
  defaultConfig
}