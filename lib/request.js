const axios = require('axios')
// const DownloadGitRepo = require('download-git-repo')
const DownloadGitRepo = require('zdex-downloadgitrepo')
const util = require('util');
const { queryConfig } = require('./utils');
// DownloadGitRepo不支持promise，使用util.promisify对其进行promise化
const downloadGitRepo = util.promisify(DownloadGitRepo)

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么，比如处理返回的数据
  return response.data;
}, function (error) {
  // 对响应错误做点什么，比如显示错误消息
  return Promise.reject(error);
});

let org; // 组织名称
let mode; // 采用模版版本控制的方式：branches or tags
let ctx = queryConfig()
org = ctx.org
mode = ctx.mode
console.log('ctx--->', ctx);
// let serve = 'gitee.com'
let serve = 'github'
let serve_dict = {
  github: {
    getReposUrl () {
      return `https://api.github.com/orgs/${org}/repos`
    },
    getTagsUrl (repo) {
      return `https://api.github.com/repos/${org}/${repo}/tags`
    },
    getBranchesUrl (repo) {
      return `https://api.github.com/repos/${org}/${repo}/branches`
    },
    getDownloadUrl (repo, tag) {
      return `${org}/${repo}${tag ? `#${tag}` : ''}`
    }
  },
  gitee: {
    getReposUrl () {
      return `https://gitee.com/api/v5/orgs/${org}/repos`
    },
    getTagsUrl (repo) {
      return `https://gitee.com/api/v5/repos/${org}/${repo}/tags`
    },
    getBranchesUrl (repo) {
      return `https://gitee.com/api/v5/repos/${org}/${repo}/branches`
    },
    getDownloadUrl (repo, tag) {
      return `gitee:${org}/${repo}${tag ? `#${tag}` : ''}`
    }
  }
}
// gitee.com
function getReposUrl () {
  return serve_dict[serve].getReposUrl()
}
function getTagsUrl (repo) {
  return serve_dict[serve].getTagsUrl(repo)
}
function getBranchesUrl (repo) {
  return serve_dict[serve].getBranchesUrl(repo)
}
function getDownloadUrl (repo, tag) {
  return serve_dict[serve].getDownloadUrl(repo, tag)
}
function fetchRepos () {
  const url = getReposUrl()
  return axios.get(url)  
}
function fetchTags (repo) {
  let url = getBranchesUrl(repo);
  if (mode === 'tags') {
    url = getTagsUrl(repo)
  }
  return axios.get(url)  
}
async function downloadSource (repo, tag, target) {
  const url = getDownloadUrl(repo, tag)
  try {
    const result = await downloadGitRepo(url, target)
    return result
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = {
  fetchRepos,
  fetchTags,
  downloadSource
}