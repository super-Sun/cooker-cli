// - 配置可执行命令 commander
const { program } = require("commander");
const chalk = require("chalk");

const start = () => {
  // 设置命令
  program
    .command("create <app-name>")
    .description("开始创建项目，项目名称<app-name>")
    .option("-f, --force", "如果项目名称已存在，执行覆盖并创建新项目")
    .action((appName, option) => {
      const create = require("../lib/create");
      create(appName, option);
    });
  program
    .command("config [value]")
    .description("添加、修改、删除配置项")
    .option("-g, --get <key>", "获取配置项<key>的值")
    .option("-s, --set <key> <value>", "添加配置项<key>的值")
    .option("-d, --delete <key>", "删除配置项<key>的值")
    .option("--show", "查看当前所有配置项")
    .option("--reset", "重置恢复成默认配置")
    .action((value, option) => {
      const conf = require("../lib/config");
      conf(value, option);
    });

  // 配置基本信息
  program
    .usage("<command> [option]")
    .version(`${require("../package.json").version}`)
    .description("用于创建一个模版前端项目");

  // 命令行提示
  program.on("--help", function () {
    console.log();
    console.log(
      `Run ${chalk.cyan(`${require("../package.json").name} <command> --help`)} 查看更多命令信息`
    );
  });
  program.parse(process.argv);
};
module.exports = {
  start,
};
