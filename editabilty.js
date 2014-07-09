(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Editability = {};

  Editability.Editor = (function() {
    function Editor() {
      this.onKeyDown = __bind(this.onKeyDown, this);
      this.onDocumentClick = __bind(this.onDocumentClick, this);
      this.stopEditing = __bind(this.stopEditing, this);
      this.save = __bind(this.save, this);
    }

    Editor.prototype.template = "<span class=\"inline-editor\">\n  <input type=\"text\" class=\"form-control\">\n  <button class=\"btn btn-default btn-cancel\">Cancel</button>\n  <button class=\"btn btn-primary btn-save\">Save</button>\n</span>";

    Editor.prototype.fieldSelector = 'input';

    Editor.prototype.siblingEditorClasses = [];

    Editor.instance = function() {
      if (!this._instance) {
        this._instance = new this.prototype.constructor();
      }
      return this._instance;
    };

    Editor.prototype.destroyElement = function() {
      this.editor.trigger('autosize.destroy');
      this.el.remove();
      return this.el = null;
    };

    Editor.prototype.createElement = function() {
      this.el = $(this.template);
      this.editor = this.el.find(this.fieldSelector);
      this.el.on('click', '.btn-save', (function(_this) {
        return function() {
          _this.save();
          return false;
        };
      })(this));
      this.el.on('click', '.btn-cancel', (function(_this) {
        return function() {
          _this.cancel();
          return false;
        };
      })(this));
      return this.el.on('keydown', this.fieldSelector, this.onKeyDown);
    };

    Editor.prototype.addSiblingEditorClass = function(editorClass) {
      return this.siblingEditorClasses.push(editorClass);
    };

    Editor.prototype.edit = function(container, _arg, callback) {
      var content, editableElement, mustHaveContent;
      editableElement = _arg.editableElement, content = _arg.content, mustHaveContent = _arg.mustHaveContent;
      this.cancelSiblingEditors();
      this.createElement();
      if (!editableElement) {
        editableElement = container.is('.editable') ? container : container.find('.editable');
      }
      if (editableElement.length > 1) {
        editableElement = editableElement.eq(0);
      }
      this.current = {
        container: container,
        content: content,
        editableElement: editableElement,
        mustHaveContent: mustHaveContent,
        callback: callback
      };
      container.addClass('editing');
      this.el.insertAfter(editableElement);
      editableElement.hide();
      this.editor.val(content);
      if (this.fieldSelector === 'textarea' && this.editor.autosize) {
        this.editor.autosize({
          callback: (function(_this) {
            return function() {
              return _this.el.trigger('autosize.resize');
            };
          })(this)
        }).trigger('autosize.resize');
      }
      this.editor.focus();
      this.editor.select();
      return setTimeout((function(_this) {
        return function() {
          return $(document).on('click', _this.onDocumentClick);
        };
      })(this), 0);
    };

    Editor.prototype.save = function() {
      var callback, newValue;
      if (!this.current.mustHaveContent || this.current.mustHaveContent && this.editor.val()) {
        if (this.current != null) {
          callback = this.current.callback;
        }
        newValue = this.editor.val();
        this.stopEditing();
        if (callback != null) {
          return callback(newValue);
        }
      }
    };

    Editor.prototype.cancel = function() {
      var callback, content, _ref;
      if (this.current != null) {
        _ref = this.current, callback = _ref.callback, content = _ref.content;
      }
      this.stopEditing();
      if (callback != null) {
        return callback(null, content);
      }
    };

    Editor.prototype.focus = function() {
      return this.editor.focus();
    };

    Editor.prototype.stopEditing = function() {
      if (!this.current) {
        return;
      }
      $(document).off('click', this.onDocumentClick);
      this.destroyElement();
      this.current.container.removeClass('editing');
      this.current.editableElement.show();
      return this.current = null;
    };

    Editor.prototype.cancelSiblingEditors = function() {
      var siblingClass, siblingEditor, _i, _len, _ref, _results;
      if (this.current != null) {
        this.cancel();
      }
      _ref = this.siblingEditorClasses;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        siblingClass = _ref[_i];
        siblingEditor = siblingClass.instance();
        if (siblingEditor !== this) {
          _results.push(siblingEditor.cancel());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Editor.prototype.onDocumentClick = function(event) {
      var clickIsInEditor, target;
      clickIsInEditor = false;
      target = event.target;
      while (target != null) {
        if (target === this.el[0]) {
          clickIsInEditor = true;
        }
        if (clickIsInEditor) {
          break;
        }
        target = target.parentNode;
      }
      if (!clickIsInEditor) {
        return this.cancel();
      }
    };

    Editor.prototype.onKeyDown = function(event) {
      if (event.keyCode === 13) {
        this.save();
      }
      if (event.keyCode === 27) {
        return this.cancel();
      }
    };

    return Editor;

  })();

  Editability.MultilineEditor = (function(_super) {
    __extends(MultilineEditor, _super);

    function MultilineEditor() {
      this.onKeyDown = __bind(this.onKeyDown, this);
      return MultilineEditor.__super__.constructor.apply(this, arguments);
    }

    MultilineEditor.prototype.template = "<div class=\"inline-editor\">\n  <div class=\"form-group\">\n    <textarea rows=\"1\" class=\"form-control\"></textarea>\n  </div>\n  <button class=\"btn btn-default btn-sm btn-cancel\">Cancel</button>\n  <button class=\"btn btn-primary btn-sm btn-save pull-right\">Save</button>\n</div>";

    MultilineEditor.prototype.fieldSelector = 'textarea';

    MultilineEditor.prototype.onKeyDown = function(event) {
      if (event.metaKey && event.keyCode === 13) {
        this.save();
      }
      if (event.keyCode === 27) {
        return this.cancel();
      }
    };

    return MultilineEditor;

  })(Editability.Editor);

}).call(this);
