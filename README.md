# Editability

Provides dead simple js editors for single and multiline inline editing.

## Dependencies

jQuery is all you need.

## Usage

```html
<div class="comment">
  <h2 class="title editable">zomgkittens</h2>
  <div class="content editable">Yep, this is a comment.</div>
</div>
```

```coffee
commentModel = # some model
container = $('.comment')
editableElement = $('.comment .title')
Editability.Editor.instance().edit container, {editableElement, content: model.get('title')}, (content) =>
  # Save the content to the server
  model.save {title: content}

  # You must explicitly update it, or let your binding framework do it!
  editableElement.text(content)
```

It will hide your `editableElement`, and append the editor after the `editableElement`. When the user clicks save or hits `cmd+enter`, it will call your callback.

### Styling

There is no default styling. Do it yourself!

### Changing templates

Subclass one of the editors, and provide your own template.

```coffee
class MyEditor extends Editability.Editor
  template: """
    <span class="inline-editor">
      <input type="text" class="whatever-i-want">
      <button class="cray-btn">Cancel</button>
      <button class="cray-btn">Save</button>
    </span>
  """
  fieldSelector: 'input'
```

Default template for `Editability.Editor`:

```html
<span class="inline-editor">
  <input type="text" class="form-control">
  <button class="btn btn-default btn-cancel">Cancel</button>
  <button class="btn btn-primary btn-save">Save</button>
</span>
```

For the `Editability.MultilineEditor`:

```html
<div class="inline-editor">
  <div class="form-group">
    <textarea class="form-control"></textarea>
  </div>
  <button class="btn btn-default btn-sm btn-cancel">Cancel</button>
  <button class="btn btn-primary btn-sm btn-save pull-right">Save</button>
</div>
```


## Local development

### If you already have grunt and bower

Navigate to the root directory of this repo. Then run:

1. `npm install`
2. `bower install`
3. `grunt`

### Installing grunt

Dont have `grunt`? Install `grunt-cli` globally with `npm install -g grunt-cli`.

### Installing bower

Dont have `bower`? Install `bower` globally with `npm install -g bower`.

### WTF is npm?

**Unfamiliar with `npm`? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.
