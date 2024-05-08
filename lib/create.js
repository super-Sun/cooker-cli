const path = require("path");
const fs = require('fs-extra');
const Inquirer = require("inquirer");
const chalk = require("chalk");

const { downloadSource, fetchRepos, fetchTags } = require("./request");
const { useLoading, queryConfig } = require("./utils");

const {type} = queryConfig()

async function beforeCreate(projectName, option) {
  // 获取当前命令执行的路径
  let cwd = process.cwd();
  let dir = path.join(cwd, projectName);
  if (fs.existsSync(dir)) {
    if (!option.force) {
      // 文件夹已经存在是否进行覆盖
      console.log("文件夹已经存在是否进行覆盖");
      const { action } = await Inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "文件夹已经名称已经存在，是否进行覆盖？",
          choices: [
            { name: "覆盖", value: true },
            { name: "取消", value: false },
          ],
        },
      ]);
      if (!action) {
        return false;
      }
    }
    // 删除文件夹
    await fs.remove(dir);
  }
  return true;
}

async function run(projectName, option) {
  // 获取选择模版集合
  const repos = await useLoading(fetchRepos, "正在获取模版列表...");
  
  const templates = repos.map((repo) => {
    if (type === 'gitlab') {
      repo.cVal = repo.id
    } else {
      repo.cVal = repo.name;
    }
    return { name: `${repo.name} (${repo.description || '😊'})`, value: repo.cVal };
  });
  const { repo } = await Inquirer.prompt([
    {
      name: "repo",
      type: "list",
      choices: templates,
      message: "选择你要的模版",
    },
  ]);
  // 获取选择模版版本
  let tags = await useLoading(fetchTags, "正在获取模版版本信息...", repo);
  // tags = tags.filter(tag => {
  //   if (type === 'gitlab') {
  //     tag.cVal = mode === 'tags' ? tag.id : tag.commit.id
  //   } else {
  //     tag.cVal = tag.name;
  //   }
  //   return tag.name !== 'main'
  // })
  const versions = tags.map((tag) => {
    if (type === 'gitlab') {
      tag.cVal = mode === 'tags' ? tag.id : tag.commit.id
    } else {
      tag.cVal = tag.name;
    }
    return { name: tag.name, value: tag.cVal };
  });
  const { tag } = await Inquirer.prompt([
    {
      name: "tag",
      type: "list",
      choices: versions,
      message: "选择你要的模版版本",
    },
  ]);
  // 下载资源
  let cwd = process.cwd();
  let dir = path.join(cwd, projectName);
  try {
    await useLoading(downloadSource, "正在下载资源...", repo, tag, dir);
    console.log();
    console.log(chalk.cyan("下载完成~"));;
    console.log();
  } catch (error) {
  }
}

async function create(projectName, option) {
  // 创建项目-前期工作
  // 1.获取项目路径
  // 2.判断项目是否存在
  // 3.存在，是否覆盖
  const isRun = await beforeCreate(projectName, option);
  // 创建项目
  if (isRun) {
    await run(projectName, option);
  }
}

module.exports = create;
