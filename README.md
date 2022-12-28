

# Rubocop for Visual Studio Code - revived
It seems the original extension is no longer being maintained. Let's pick it up from here.

Don't forget to give the extension a review in the marketplace.

Marketplace: [https://marketplace.visualstudio.com/items?itemName=LoranKloeze.ruby-rubocop-revived](https://marketplace.visualstudio.com/items?itemName=LoranKloeze.ruby-rubocop-revived)

# Docs

This extension provides interfaces to rubocop for vscode. All versions of **Rubcop >= 1.30.0** are supported.

[rubocop](https://github.com/bbatsov/rubocop) is a code analyzer for ruby.

![exec on save](./images/onsave.gif)

<img width="604" alt="Rubocop Quick Fix Tooltip - Correctable" src="https://user-images.githubusercontent.com/31414818/185810703-1edfe010-cd85-4a07-a5ee-a982d6eec214.png">

<img width="284" alt="Rubocop Quick Fix List - Correctable" src="https://user-images.githubusercontent.com/31414818/185810725-6919d0be-0859-4a1d-b708-930e48aa0fda.png">

<img width="647" alt="Rubocop Quick Fix Tooltip - Uncorrectable" src="https://user-images.githubusercontent.com/31414818/185810905-f6870228-ac9c-401a-9df0-76910a30981f.png">

<img width="346" alt="Rubocop Quick Fix List - Uncorrectable" src="https://user-images.githubusercontent.com/31414818/185810938-9674ae32-dfed-4337-84b9-4a4840a38e51.png">

![Rubocop Quick Fixes Demo](https://user-images.githubusercontent.com/31414818/185810560-bbc8363e-253e-4b84-9b5f-545949eb8712.gif)

## Problems

This extension may have problems when using a rvm or chruby environment.
We recommend [vscode-ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.Ruby). It can also lint ruby code.

When autoCorrect is enabled, the history of changing file is broken.

## Features

- lint by executing the command "Ruby: lint by rubocop" (cmd+shift+p and type command)
- auto correct when saving a file
- auto correct command "Ruby: autocorrect by rubocop"
- quick fixes so you can fix or ignore an error [PR with explanation](https://github.com/LoranKloeze/vscode-ruby-rubocop-revived/pull/7)

### Exclude file

The extension forces rubocop's `force-exclusion` option.

If you do not want rubocop to be executed on some file, you can add AllCops/Exclude in rubocop.yml. The file can be saved without executing rubocop.

# Installation

Installation of ruby and rubocop is required.

```
gem install rubocop
```

- Type F1 (or Command + Shift + P)
- execute "Extensions: install extension"
- type rubocop and execute `ext install ruby-rubocop`

If VSCode market place is not configured in your FLOSS distribution of code (you have Open VSX instead):

1. Go on [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=misogi.ruby-rubocop) and clic on the [Download Extension](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/misogi/vsextensions/ruby-rubocop/0.8.5/vspackage) button.
2. Install the extension manually from the CLI: `code --install-extension misogi.ruby-rubocop-0.8.5.vsix`

# ChangeLog

[ChangeLog](CHANGELOG.md)

## Configuration

Specify configuration (via navigating to `File > Preferences > Workspace Settings` and editing file `settings.json):`

```javascript
{
  // If not specified searches for 'rubocop' executable available on PATH (default and recommended)
  "ruby.rubocop.executePath": "",

  // You can use specific path
  // "ruby.rubocop.executePath": "/Users/you/.rbenv/shims/"
  // "ruby.rubocop.executePath": "/Users/you/.rvm/gems/ruby-2.3.2/bin/"
  // "ruby.rubocop.executePath": "D:/bin/Ruby22-x64/bin/"

  // If not specified, it assumes a null value by default.
  "ruby.rubocop.configFilePath": "/path/to/config/.rubocop.yml",

  // default true
  "ruby.rubocop.onSave": true
  
  // use the --server option when running Rubocop - default false
  "ruby.rubocop.useServer": true
}
```

### Keybindings

You can change the keybinding (via editing `keybindings.json`)

```javascript
{ "key": "ctrl+alt+l",          "command": "ruby.rubocop.autocorrect",
                                "when": "editorLangId == 'ruby'" }
```

# todo

- more configurable command line options (like -R)
- integration with rbenv
- testing & CI support

# Contribute with this extension

Please install packages with yarn.

    yarn install

You could install TSLint extension for .ts files.

Please format code using prettier.

```
yarn prettier src/* test/* --write
```

# License

このソフトウェアは MIT ライセンスの元で公開されています。[LICENSE.txt](LICENSE.txt) をご覧下さい。

This software is released under the MIT License, see [LICENSE.txt](LICENSE.txt).
