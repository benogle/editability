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

  @instance: ->
    @_instance = new @prototype.constructor() unless @_instance
    @_instance

  constructor: ->
    @el = $(@template)
    @editor = @el.find(@fieldSelector)

    @el.on 'click', '.btn-save', => @save(); false
    @el.on 'click', '.btn-cancel', => @stopEditing(); false
    @el.on 'keydown', @fieldSelector, (event) =>
      @save() if event.metaKey and event.keyCode == 13
      @stopEditing() if event.keyCode == 27

  # `container` is the container element of the thing to edit. So the .comment.
  # It will look for an element with the class `.editable`. The editor will be
  # placed next to this .editable element.
  edit: (container, {editableElement, content}, callback) ->
    @stopEditing()

    unless editableElement
      editableElement = if container.is('.editable')
        container
      else
        container.find('.editable')

    editableElement = editableElement.eq(0) if editableElement.length > 1

    @current = {container, editableElement, callback}

    container.addClass('editing')

    @el.insertAfter editableElement
    editableElement.hide()

    @editor.val(content)
    if @fieldSelector == 'textarea'
      @editor.attr('rows', (content or '').split('\n').length)
      @editor.autosize() if @editor.autosize
    @editor.focus()
    @editor.select()

  save: =>
    if @editor.val()
      @current.callback(@editor.val()) if @current
      @stopEditing()

  stopEditing: =>
    return unless @current

    @editor.trigger('autosize.destroy')
    @el.detach()

    @current.container.removeClass('editing')
    @current.editableElement.show()
    @current = null

class Editability.MultilineEditor extends Editability.Editor
  template: """
    <div class="inline-editor">
      <div class="form-group">
        <textarea class="form-control"></textarea>
      </div>
      <button class="btn btn-default btn-sm btn-cancel">Cancel</button>
      <button class="btn btn-primary btn-sm btn-save pull-right">Save</button>
    </div>
  """
  fieldSelector: 'textarea'
