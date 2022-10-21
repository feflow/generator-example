'use strict';

const chalk = require('chalk');
const minimist = require('minimist');
const yosay = require('yosay');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);
    const [yeomanArgs, feflowCtx] = arguments;
    this.feflowCtx = feflowCtx;

    this.answers = {};
  }

  /**
   * Print welcome message
   */
  initializing() {
    this.log(yosay('Feflow 脚手架示例'));
    this.log(chalk.magenta('尊贵的开发者，欢迎您'
        + '\n'
        + '这是 Feflow 的官方 React 项目脚手架, Powered by http://www.feflowjs.com/.'
        + '\n'));
    this.feflowCtx.logger.debug('初始化成功');
  }

  /**
   * Interact with developer.
   */
  prompting() {
    const { config } = minimist(process.argv.slice(2));
    if (config) {
      return this.answers = JSON.parse(config);
    }

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: '请输入项目名称',
      default: 'my-project',
    }, {
      type: 'input',
      name: 'description',
      message: '请输入项目描述信息',
      default: '项目基本描述',
    }, {
      type: 'input',
      name: 'version',
      message: '请输入版本 (1.0.0):',
      default: '1.0.0',
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  /**
   * Copy templates
   */
  writing() {
    const { name } = this.answers;
    this.destinationRoot(this.destinationPath(name));

    this.fs.copyTpl(
      `${this.templatePath()}/**/!(_)*`,
      this.destinationPath(),
      this.answers,
      {},
      { globOptions: { dot: true } },    // Copy all dots files.
    );
  }

  /**
   * Install dependencies
   */
  install() {
    this.console.log('安装依赖，过程持续1~2分钟');
    this.npmInstall();
  }

  /**
   * Prompt user to start project
   */
  end() {
    const { name } = this.answers;

    console.log('本次初始化过程结束, 请通过以下命令运行项目: ');
    console.log();
    console.log(chalk.cyan('  cd'), name);
    console.log(`  ${chalk.cyan('fef dev')}`);
    console.log();
    console.log('编码愉快!');
    
    this.feflowCtx.logger.debug('创建项目成功');
  }
};
