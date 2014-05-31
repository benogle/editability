(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Editability = {};

  Editability.Editor = (function() {
    Editor.prototype.template = "<span class=\"inline-editor\">\n  <input type=\"text\" class=\"form-control\">\n  <button class=\"btn btn-default btn-cancel\">Cancel</button>\n  <button class=\"btn btn-primary btn-save\">Save</button>\n</span>";

    Editor.prototype.fieldSelector = 'input';

    Editor.instance = function() {
      if (!this._instance) {
        this._instance = new this.prototype.constructor();
      }
      return this._instance;
    };

    function Editor() {
      this.stopEditing = __bind(this.stopEditing, this);
      this.save = __bind(this.save, this);
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
          _this.stopEditing();
          return false;
        };
      })(this));
      this.el.on('keydown', this.fieldSelector, (function(_this) {
        return function(event) {
          if (event.metaKey && event.keyCode === 13) {
            _this.save();
          }
          if (event.keyCode === 27) {
            return _this.stopEditing();
          }
        };
      })(this));
    }

    Editor.prototype.edit = function(container, _arg, callback) {
      var content, editableElement;
      editableElement = _arg.editableElement, content = _arg.content;
      this.stopEditing();
      if (!editableElement) {
        editableElement = container.is('.editable') ? container : container.find('.editable');
      }
      if (editableElement.length > 1) {
        editableElement = editableElement.eq(0);
      }
      this.current = {
        container: container,
        editableElement: editableElement,
        callback: callback
      };
      container.addClass('editing');
      this.el.insertAfter(editableElement);
      editableElement.hide();
      this.editor.val(content);
      if (this.fieldSelector === 'textarea') {
        this.editor.attr('rows', (content || '').split('\n').length);
        if (this.editor.autosize) {
          this.editor.autosize();
        }
      }
      this.editor.focus();
      return this.editor.select();
    };

    Editor.prototype.save = function() {
      if (this.editor.val()) {
        if (this.current) {
          this.current.callback(this.editor.val());
        }
        return this.stopEditing();
      }
    };

    Editor.prototype.stopEditing = function() {
      if (!this.current) {
        return;
      }
      this.editor.trigger('autosize.destroy');
      this.el.detach();
      this.current.container.removeClass('editing');
      this.current.editableElement.show();
      return this.current = null;
    };

    return Editor;

  })();

  Editability.MultilineEditor = (function(_super) {
    __extends(MultilineEditor, _super);

    function MultilineEditor() {
      return MultilineEditor.__super__.constructor.apply(this, arguments);
    }

    MultilineEditor.prototype.template = "<div class=\"inline-editor\">\n  <div class=\"form-group\">\n    <textarea class=\"form-control\"></textarea>\n  </div>\n  <button class=\"btn btn-default btn-sm btn-cancel\">Cancel</button>\n  <button class=\"btn btn-primary btn-sm btn-save pull-right\">Save</button>\n</div>";

    MultilineEditor.prototype.fieldSelector = 'textarea';

    return MultilineEditor;

  })(Editability.Editor);

}).call(this);
