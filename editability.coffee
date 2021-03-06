window.Editability = {}

# An inline content editor with an input
class Editability.Editor
  template: """
    <span class="inline-editor">
      <input type="text" class="form-control">
      <button class="btn btn-default btn-cancel">Cancel</button>
      <button class="btn btn-primary btn-save">Save</button>
    </span>
  """
  fieldSelector: 'input'
  siblingEditorClasses: []

  @instance: ->
    @_instance = new @prototype.constructor() unless @_instance
    @_instance

  destroyElement: ->
    @editor.trigger('autosize.destroy')
    @el.remove()
    @el = null

  createElement: ->
    @el = $(@template)
    @editor = @el.find(@fieldSelector)

    @el.on 'click', '.btn-save', => @save(); false
    @el.on 'click', '.btn-cancel', => @cancel(); false
    @el.on 'keydown', @fieldSelector, @onKeyDown

  addSiblingEditorClass: (editorClass) ->
    @siblingEditorClasses.push(editorClass)

  # `container` is the container element of the thing to edit. So the .comment.
  # It will look for an element with the class `.editable`. The editor will be
  # placed next to this .editable element.
  edit: (container, {editableElement, content, mustHaveContent}, callback) ->
    @cancelSiblingEditors()
    @createElement()

    unless editableElement
      editableElement = if container.is('.editable')
        container
      else
        container.find('.editable')
    editableElement = editableElement.eq(0) if editableElement.length > 1

    @current = {container, content, editableElement, mustHaveContent, callback}

    container.addClass('editing')

    @el.insertAfter(editableElement)
    editableElement.hide()

    @editor.val(content)
    if @fieldSelector == 'textarea' and @editor.autosize
      @editor.autosize(callback: => @el.trigger('autosize.resize')).trigger('autosize.resize')
    @editor.focus()
    @editor.select()

    setTimeout =>
      $(document).on 'click', @onDocumentClick
    , 0

  save: =>
    if not @current.mustHaveContent or @current.mustHaveContent and @editor.val()
      {callback} = @current if @current?
      newValue = @editor.val()
      @stopEditing()
      callback(newValue) if callback?

  cancel: ->
    {callback, content} = @current if @current?
    @stopEditing()
    callback(null, content) if callback?

  focus: -> @editor.focus()

  stopEditing: =>
    return unless @current

    $(document).off 'click', @onDocumentClick

    @destroyElement()

    @current.container.removeClass('editing')
    @current.editableElement.show()
    @current = null

  cancelSiblingEditors: ->
    @cancel() if @current?
    for siblingClass in @siblingEditorClasses
      siblingEditor = siblingClass.instance()
      siblingEditor.cancel() unless siblingEditor == this

  onDocumentClick: (event) =>
    clickIsInEditor = false

    {target} = event
    while target?
      clickIsInEditor = true if target == @el[0]
      break if clickIsInEditor
      target = target.parentNode

    @cancel() unless clickIsInEditor

  onKeyDown: (event) =>
    @save() if event.keyCode == 13
    @cancel() if event.keyCode == 27

class Editability.MultilineEditor extends Editability.Editor
  template: """
    <div class="inline-editor">
      <div class="form-group">
        <textarea rows="1" class="form-control"></textarea>
      </div>
      <button class="btn btn-default btn-sm btn-cancel">Cancel</button>
      <button class="btn btn-primary btn-sm btn-save pull-right">Save</button>
    </div>
  """
  fieldSelector: 'textarea'

  onKeyDown: (event) =>
    @save() if event.metaKey and event.keyCode == 13
    @cancel() if event.keyCode == 27
