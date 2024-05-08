const axios = require("axios");
const DownloadGitRepo = require("download-git-repo");
const util = require("util");
const unzipper = require("unzipper");
const path = require("path");
const fs = require("fs-extra");
const { createWriteStream } = require("fs");
const { queryConfig } = require("./utils");
// DownloadGitRepo不支持promise，使用util.promisify对其进行promise化
const downloadGitRepo = util.promisify(DownloadGitRepo);

let request = axios.create()

request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么，比如处理返回的数据
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么，比如显示错误消息
    return Promise.reject(error);
  }
);
let serve; // 模版仓库的类型 github gitee （gitlab暂不支持）
let org; // 组织名称
let mode; // 采用模版版本控制的方式：branches or tags
let giteeToken; // gitee的accessToken

let ctx = queryConfig();
org = ctx.org;
mode = ctx.mode;
giteeToken = ctx.giteeToken || "";
serve = ctx.type;

console.log("ctx--->", ctx);

let serve_dict = {
  github: {
    getReposUrl() {
      return `https://api.github.com/orgs/${org}/repos`;
    },
    getTagsUrl(repo) {
      return `https://api.github.com/repos/${org}/${repo}/tags`;
    },
    getBranchesUrl(repo) {
      return `https://api.github.com/repos/${org}/${repo}/branches`;
    },
    getDownloadUrl(repo, tag) {
      return `${org}/${repo}${tag ? `#${tag}` : ""}`;
    },
  },
  gitee: {
    getReposUrl() {
      return `https://gitee.com/api/v5/orgs/${org}/repos`;
    },
    getTagsUrl(repo) {
      return `https://gitee.com/api/v5/repos/${org}/${repo}/tags`;
    },
    getBranchesUrl(repo) {
      return `https://gitee.com/api/v5/repos/${org}/${repo}/branches`;
    },
    getDownloadUrl(repo, tag) {
      return `https://gitee.com/api/v5/repos/${org}/${repo}/zipball?access_token=${giteeToken}&ref=${
        tag || "master"
      }`;
    },
  },
};
// gitee.com
function getReposUrl() {
  return serve_dict[serve].getReposUrl();
}
function getTagsUrl(repo) {
  return serve_dict[serve].getTagsUrl(repo);
}
function getBranchesUrl(repo) {
  return serve_dict[serve].getBranchesUrl(repo);
}
function getDownloadUrl(repo, tag) {
  return serve_dict[serve].getDownloadUrl(repo, tag);
}
function fetchRepos() {
  const url = getReposUrl();
  return request.get(url);
}
function fetchTags(repo) {
  let url = getBranchesUrl(repo);
  if (mode === "tags") {
    url = getTagsUrl(repo);
  }
  return request.get(url);
}
async function downloadSource(repo, tag, target) {
  const url = getDownloadUrl(repo, tag);
  try {
    if (serve === 'github') {
      await downloadGitRepo(url, target)
    } else if (serve === 'gitee') {
      await downloadZipSource(url, target, repo, tag);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}
async function stream2zip(stream, dir) {
  const writer = createWriteStream(`${dir}`);
  stream.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
async function unzipFile(tempDir) {
  return new Promise((resolve, reject) => {
    // 解压文件
    fs.createReadStream(`${tempDir}`)
      .pipe(unzipper.Extract({ path: path.resolve(
        __dirname,
        `../templates`
      )}))
      .on("close", resolve)
      .on("error", reject);
  });
}

async function moveFile (from, to) {
  return await fs.copySync(from, to)
}
async function cleanTemplates () {
  return await fs.emptyDir(path.resolve(__dirname, '../templates'))
}

function getFileName (contentDisposition) {
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(contentDisposition);
  let filename = ''; // 默认文件名
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, ''); // 去除可能存在的引号
  }
  return filename
}

async function downloadZipSource(url, target, repo, tag) {
  let tempDir = path.resolve(__dirname, `../templates/${repo}@${tag}.zip`)
  const response = await axios({
    method: "get",
    url,
    responseType: "stream",
  });
  const contentDisposition = response.headers['content-disposition'];
  const filename = getFileName(contentDisposition)
  if (filename) {
    tempDir = path.resolve(__dirname, `../templates/${filename}`)
  }
  if (tempDir.indexOf('.zip') < 0) {
    tempDir = `${tempDir}.zip`
  }
  // 数据流转成zip文件
  await stream2zip(response.data, tempDir);
  // 分解文件
  await unzipFile(tempDir);
  // copy到目标目录下
  await moveFile(tempDir.replace('.zip', ''), target)
  // 清空临时文件夹
  await cleanTemplates()
}

module.exports = {
  fetchRepos,
  fetchTags,
  downloadSource,
};
