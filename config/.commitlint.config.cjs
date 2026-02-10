/** @type {import('@commitlint/types').UserConfig} */
const RE_CONVENTIONAL_COMMIT =
  /^(\w+)(?:\(([\w$\.\*/-]+)\))?:\s+((?::\w+:|[\p{Emoji}\uFE0F]+))\s+(.+)$/u;

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
        headerPattern: RE_CONVENTIONAL_COMMIT,
        headerCorrespondence: ['type', 'scope', 'emoji', 'subject']
    }
  },
  rules: {
    'cz-emoji': [2, 'always'],
    'type-enum': [
      2,
      'always',
      [
        'style', 'perf', 'prune', 'fix', 'quickfix', 'feature', 'docs', 'deploy', 'ui', 'init',
        'test', 'security', 'osx', 'linux', 'windows', 'android', 'ios', 'release', 'lint',
        'wip', 'fix-ci', 'downgrade', 'upgrade', 'pushpin', 'ci', 'analytics', 'refactoring',
        'docker', 'dep-add', 'dep-rm', 'config', 'i18n', 'typo', 'poo', 'revert', 'merge',
        'dep-up', 'compat', 'mv', 'license', 'breaking', 'assets', 'review', 'access',
        'docs-code', 'beer', 'texts', 'db', 'log-add', 'log-rm', 'contrib-add', 'ux', 'arch',
        'iphone', 'clown-face', 'egg', 'see-no-evil', 'camera-flash', 'experiment', 'seo',
        'k8s', 'types', 'seed', 'flags', 'animation', 'wastebasket', 'passport-control',
        'adhesive-bandage', 'monocle-face', 'coffin', 'test-tube', 'necktie', 'stethoscope',
        'bricks', 'technologist', 'transcend'
      ]
    ]
  },
  plugins: [
    {
      rules: {
        'cz-emoji': ({ raw }) => {
          const clean = raw
            .normalize('NFKD')
            .replace(/\p{Variation_Selector}/gu, '')
            .replace(/\s+/g, ' ')
            .trim();

          const match = RE_CONVENTIONAL_COMMIT.exec(clean);
          return [!!match, 'Expected format: <type>(<scope>): <emoji> <subject>'];
        }
      }
    }
  ]
};
