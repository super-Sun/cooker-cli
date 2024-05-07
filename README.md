cooker-cli
===



`cooker-cli` 能够快速生成你能想象得到的各种模版项目: `vue2`, `vue3`, `react`, `mini-program...`

## What
这个脚手架的用途是帮助你整理模版项目，模版项目需要你自己在模版库中DIY，从而在后续的使用中快速生成你要的模版项目。

## WHY

根据以往业务的经验，即使在这个脚手架中提供了模版，也满足不了大多数人的需求。因为对于日益更新的技术栈，项目可以有多种多样的库搭配组合，排列组合之下，产出的模版何其多也\(^o^)/~

并且即使有提供了模版，如果不能持续迭代，要不了多久，也就废弃了。所以，不如将这个功能放给使用者，这样可以使用者可以DIY项目模版，方便随时调整和迭代，从而不被脚手架所限制。


## Install

```
$ npm install -g cooker-cli
```

## Example

- 创建项目-演示使用

```bash
$ cooker-cli create <project-name>
✔ 正在获取模版列表...
? 选择你要的模版 (Use arrow keys)
❯ h5-template-vue (h5的vue项目模版)
  h5-template-react (h5的react项目模版)
  pc-template-vue (pc的vue项目模版)
  pc-template-react (pc的react项目模版)
  minProgram-template (小程序项目模版)
  ----------------------------------
? 选择你要的模版 h5-template-vue (h5的vue项目模版)
✔ 正在获取模版版本信息...
? 选择你要的模版版本 (Use arrow keys)
❯ vue2-js
  vue2-vuex-js
  vue3-js
  vue3-ts
  ----------------------------------
  ⠏ 正在下载资源...
  ----------------------------------
✔ 下载完成~
```

- 配置你自己的模版

  - 1.你需要拥有一个github账号

  - 2.注册组织机构账号，在github账号内即可免费注册完成

    - 步骤如下
    - create new...  --> New Organizational --> 后面按照提示完成注册即可
    - 得到`机构名称`  => 为了方便，统一称作 `org`

  - 3.在你创建的机构下，创建你的模版，这个创建的模版你将在这里看到

    > 这里的`模版`可以理解为`模版大类`，比如pc的vue项目、pc的react项目、h5的vue项目、h5的react项目、小程序项目

    ```bash
    ✔ 正在获取模版列表...
    ? 选择你要的模版 (Use arrow keys)
    ❯ h5-template-vue (h5的vue项目模版)
      h5-template-react (h5的react项目模版)
      pc-template-vue (pc的vue项目模版)
      pc-template-react (pc的react项目模版)
      minProgram-template (小程序项目模版)
    ```

  - 4.按照你自己的分类创建完成多个模版以后，进入其中一个模版项目，

  - 5.此时，你可以通过`分支(branches)`或者`标记(tags)`来创建模版对应的多个版本，你将在这里看到

    > 这里的`模版版本`可以理解为`模版大类`下的`细分`，比如pc的vue项目大类下，分为：vue2项目、vue3项目、使用vuex的项目、使用ts的项目等等，可以更加实际业务场景自己去细分

    ```bash
    ? 选择你要的模版版本 (Use arrow keys)
    ❯ vue2-js
      vue2-vuex-js
      vue3-js
      vue3-ts
    ```

  - 6.做完以后操作以后，你就可以去修改cooker-cli的配置文件了，在开始之前可以先了解一下内容

    > 查看配置信息: cooker-cli config -show
    > 修改配置信息: cooker-cli config --set <key> <value>
    >
    > 恢复默认配置信息: cooker-cli config --reset

  - 7.将配置中的组织名称，修改为你自己创建的`org`

    ```bash
    # organization-name 默认值: niu-fly，为演示项目
    $ cooker-cli config --set=org <your github organization-name>
    ```

  - 8.如果你在步骤5中采用tags来管理版本，那么你需要进行下面的配置

    ```bash
    # mode 默认值: branches
    $ cooker-cli config --set=mode tags
    ```

  - 9.做完以上操作，你可以完全按照自己的意愿DIY自己的模版了\(^o^)/~

## Usage

```
Usage: cooker-cli <command> [option]

用于创建一个模版前端项目

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  create [options] <app-name>  开始创建项目，项目名称<app-name>
  config [options] [value]     添加、修改、删除配置项
  help [command]               display help for command

Run cooker-cli <command> --help 查看更多命令信息
```

## TODO 

1. 目前模板库`org`仅支持github中生成，后续会支持gitlab，其中gitee在多次使用命令创建项目以后报错403，还在想办法解决



## Resource 

* https://github.com/super-Sun/cooker-cli

## LICENSE
MIT

