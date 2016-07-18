'use strict';

SwaggerUi.Views.ResourceView = Backbone.View.extend({
  initialize: function(opts) {
    opts = opts || {};
    this.router = opts.router;
    this.auths = opts.auths;
    if ('' === this.model.description) {
      this.model.description = null;
    }
    if (this.model.description) {
      this.model.summary = this.model.description;
    }
  },

  render: function(){


    $(this.el).html(Handlebars.templates.resource(this.model));


    $('.toggleEndpointList', this.el).click(this.callDocs.bind(this, 'toggleEndpointListForResource'));
    $('.collapseResource', this.el).click(this.callDocs.bind(this, 'collapseOperationsForResource'));
    // $('.expandResource', this.el).click(this.callDocs.bind(this, 'expandOperationsForResource'));
    // 
    

    $('.expandResource', this.el).click(this.expandOperation.bind(this, 'expandOperationsForResource'));
    return this;
  },

  expandOperation: function(fnName, e){
    console.log("click");
    var methods = {};

    // Render each operation
    for (var i = 0; i < this.model.operationsArray.length; i++) {
      var operation = this.model.operationsArray[i];
      var counter = 0;
      var id = operation.nickname;

      while (typeof methods[id] !== 'undefined') {
        id = id + '_' + counter;
        counter += 1;
      }

      methods[id] = operation;

      operation.nickname = id;
      operation.parentId = this.model.id;
      operation.definitions = this.model.definitions; // make Json Schema available for JSonEditor in this operation
      this.addOperation(operation);
    }

    // this.addOperation(operation);
    this.callDocs(fnName, e);
  },

  addOperation: function(operation) {

    operation.number = this.number;

    // Render an operation and add it to operations li
    var operationView = new SwaggerUi.Views.OperationView({
      model: operation,
      router: this.router,
      tagName: 'li',
      className: 'endpoint',
      swaggerOptions: this.options.swaggerOptions,
      auths: this.auths
    });

    $('.endpoints', $(this.el)).append(operationView.render().el);

    this.number++;

  },
  // Generic Event handler (`Docs` is global)


  callDocs: function(fnName, e) {
    e.preventDefault();
    Docs[fnName](e.currentTarget.getAttribute('data-id'));
  }
});