(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var formValidation = function(name, email, password, verifyPassword) {
  //Email Validation in JavaScript http://www.marketingtechblog.com/javascript-regex-emailaddress/#ixzz2y7xv1RHq
  console.log(arguments);
  function checkEmail(email){
    var pattern=/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
    if(pattern.test(email)){
      return true;
    }else{
      $('#errors').html('Please provide a valid Email');
//      alert('Please provide a valid Email');
      return false;
    }
  }
  if(name===''|| email==='' || password===''|| verifyPassword===''){
    $('#errors').html('One of your fields have not been filled');
    return false;
  }
  if(password!==verifyPassword){
    $('#errors').html('Your passwords don\'t match');
    return false;
  }
  if(checkEmail(email)===false) return false;

  return true;
};

module.exports = formValidation;
},{}],2:[function(require,module,exports){
var Routes = require('./routers/Routes.js');

$(function() {
	var routes = new Routes();
	Backbone.history.start();
});

},{"./routers/Routes.js":14}],3:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/edit/",
	defaults: {
    verifyEmail: "",
    verifyPassword: "",
    newName: "",
    newEmail: "",
    newPassword: "",
	}
});

},{}],4:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/getName/",
	defaults: {
    name: ''
	}
});

},{}],5:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/checkSession/",
	defaults: {
    localEmail: ""
	}
});

},{}],6:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	defaults: {
    name: "",
    description: "",
		ingredients: "",
		directions: "",
		tag: "",
		servings: "",
		img: ""
	}
});

},{}],7:[function(require,module,exports){
var Drink = require('./Drink.js');

module.exports = Backbone.Collection.extend({

	initialize: function(models, options) {
		this.ingredient = options.ingredient;
		this.tag = options.tag;
		this.url = '/api/v1/getDrink/'+this.tag+'/'+this.ingredient;
	},

	model: Drink

});

},{"./Drink.js":6}],8:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: "/api/v1/getFirstQuestion/",
	defaults: {
		"question" : "",
		"choices" : [
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			}
		],
		"random" : ""
	}
});

},{}],9:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/saveDrink/",
	defaults: {
    localEmail: "",
    drink: ""
	}
});

},{}],10:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/getSavedItems/",
	defaults: {
    localEmail: '',
    savedDrinks: []
	}
});

},{}],11:[function(require,module,exports){
module.exports = Backbone.Model.extend({
	url: "/api/v1/getSecondQuestion/",
	defaults: {
		"question" : "",
		"choices" : [
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			},
			{
				"label" : "",
				"tag" : ""
			}
		],
		"random" : ""
	}
});

},{}],12:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/signup/",
  defaults: {
    localEmail       : '',
    localPassword    : ''
  }
});

},{}],13:[function(require,module,exports){
module.exports = Backbone.Model.extend({
  url: "/login/",
  defaults: {
    localEmail       : '',
    localPassword    : '',
    twitterId          : '',
    twitterToken       : '',
    twitterDisplayName : '',
    twitterUserName    : '',
    savedDrinks        : []
  }
});

},{}],14:[function(require,module,exports){
var Drink = require('../models/Drink.js');
var DrinkCollection = require('../models/DrinkCollections.js');
var DrinkCollectionsView = require('../views/DrinkCollectionsView.js');
var FirstQuestion = require('../models/FirstQuestion.js');
var SecondQuestion = require('../models/SecondQuestion.js');
var FirstQuestionView = require('../views/FirstQuestionView.js');
var SecondQuestionView = require('../views/SecondQuestionView.js');
var IndexView = require('../views/IndexView.js');
var User = require('../models/User.js');
var LoginView = require('../views/LoginView.js');
var SavedItemsView = require('../views/SavedItemsView.js');
var CheckSession = require('../models/CheckSession.js');
var SignupView = require('../views/signupView.js');
var Account = require('../models/Account.js');
var AccountView = require('../views/AccountView.js');

module.exports = Backbone.Router.extend({

  routes: {
    "myAccount":"showMyAccountPage",
    "savedItems": "showSavedItems",
    "signup":"showSignupPage",
    "login": "showLoginPage",
    "": "showFirstQuestion",
    ":tag": 'showSecondQuestion',
    "results/:tag/:ingredient": "getResults"

  },

  initialize: function () {
    console.log('initialized');
    this.checkSession();
    var thiz = this;

    this.login = new User();
    this.checkSession();

    var indexView;
    indexView = new IndexView({
      model: {}
    });
    $('#content').append(indexView.el);
    this.firstQuestion = new FirstQuestion();
    this.firstQuestionView = new FirstQuestionView({
      model: this.firstQuestion
    });
    var that = this;
    this.firstQuestion.fetch({
      success: function () {
        that.firstQuestionView.render();
      }
    });
    this.secondQuestion = new SecondQuestion();
    this.secondQuestion.fetch();

  },

  checkSession: function() {
    var thiz = this;
    var checkSession = new CheckSession();
    checkSession.fetch({
      dataType:'text',
      success: function(model, response){
        thiz.login.set({localEmail:response});
        $('#loggedInName').html(thiz.login.get('localEmail'));
      }
    });
  },

  showSavedItems: function() {
    var savedItemsView = new SavedItemsView();

    if (this.login.get('localEmail') === ''){
      Backbone.history.navigate('/login', {trigger:true})
      return;
    }
    else{
      savedItemsView.setLogin(this.login.get('localEmail'));
      savedItemsView.fetch();
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(savedItemsView.el);
    }

  },

  showLoginPage: function () {
    var loginView = new LoginView({model:this.login});
    $('.Question').empty();
    $('.Result').empty();
    $('.Result').append(loginView.el);
  },
  showSignupPage: function () {
    var signupView = new SignupView({model:this.login});
    $('.Question').empty();
    $('.Result').empty();
    $('.Result').append(signupView.el);
  },
  showMyAccountPage: function () {
    if (this.login.get('localEmail') === ''){
      Backbone.history.navigate('/login', {trigger:true})
      return;
    }
    else{
      var account = new Account();
      var accountView = new AccountView({model:account, login:this.login});
      $('.Question').empty();
      $('.Result').empty();
      $('.Result').append(accountView.el);
    }
  },

  showFirstQuestion: function () {
    this.checkSession();
    $('.Result').empty();
    this.firstQuestionView.render();
    $('.Question').html(this.firstQuestionView.el);
  },

  showSecondQuestion: function (tag) {
    this.checkSession();
    this.secondQuestionView = new SecondQuestionView({
      model: this.secondQuestion
    });
    this.secondQuestionView.render();
    this.secondQuestionView.setTag(tag);
    $('.Result').empty();
    $('.Question').html(this.secondQuestionView.el);
  },

  getResults: function (tag, ingredient) {
    this.checkSession();
    var thiz = this;
    function renderDrinkCollection() {
      var drinkCollectionsView = new DrinkCollectionsView({
        collection: drinkCollection
      });

      //check to see if this has been set

      if (thiz.login.get('localEmail') === ''){
        drinkCollectionsView.renderNotLoggedIn();
        $('.Question').empty();
        $('.Result').html(drinkCollectionsView.el);
      }
      else{
        drinkCollectionsView.setLogin(thiz.login.get('localEmail'));
        drinkCollectionsView.renderLoggedIn();
        $('.Question').empty();
        $('.Result').html(drinkCollectionsView.el);
      }
    }
    var drinkCollection = new DrinkCollection([], {
      tag: tag,
      ingredient: ingredient
    });
    drinkCollection.fetch({
      success: function (model) {
        renderDrinkCollection();
      }
    });
  }

});

},{"../models/Account.js":3,"../models/CheckSession.js":5,"../models/Drink.js":6,"../models/DrinkCollections.js":7,"../models/FirstQuestion.js":8,"../models/SecondQuestion.js":11,"../models/User.js":13,"../views/AccountView.js":15,"../views/DrinkCollectionsView.js":16,"../views/FirstQuestionView.js":18,"../views/IndexView.js":19,"../views/LoginView.js":20,"../views/SavedItemsView.js":21,"../views/SecondQuestionView.js":22,"../views/signupView.js":23}],15:[function(require,module,exports){
var template = require('../../../templates/myAccount.hbs');
var formValidation = require('../../Util/formValidation.js');
var Account_userName = require('../models/Account_userName.js');

module.exports = Backbone.View.extend({
  initialize: function(options) {
    this.options = options || {};
    this.render();
  },

  events: {
    'click #editInfo' : 'editInfo'
  },

  editInfo: function(e){
    e.preventDefault();
    var thiz = this;
    var verifyEmail = $(this.el).find('#verifyEmail').val();
    var verifyPassword = $(this.el).find('#verifyPassword').val();
    var newName = $(this.el).find('#newName').val();
    var newEmail = $(this.el).find('#newEmail').val();
    var newPassword = $(this.el).find('#newPassword').val();
    var newPasswordVerify = $(this.el).find('#newPasswordVerify').val();

    if (formValidation(newName,newEmail,newPassword,newPasswordVerify)===false){
      return;
    }

    this.model.set({
      verifyEmail: verifyEmail,
      verifyPassword: verifyPassword,
      newName: newName,
      newEmail: newEmail,
      newPassword: newPassword
    });

    this.model.save([], {
      dataType:'text',
      success: function(model, response){
        if (response === 'Update ok!'){
          alert('Account details changed!');
          thiz.options.login.set({localEmail:newEmail.toLowerCase()});
          $('#loggedInName').html(newEmail);
          Backbone.history.navigate('/', {trigger:true});
        }
        if(response === 'Wrong password!'){
          $('#errors').html('Wrong verification password provided!');
        }
        if(response === 'Wrong email!'){
          $('#errors').html('Wrong verification email provided!');
        }
        if(response === 'The new email you entered already exists!'){
          $('#errors').html('The new email you entered already exists!');
        }
      }
    })
  },

  fetchUserName: function() {
    var account_UserName = new Account_userName();
    account_UserName.fetch({
      success: function(){
        this.$('#userName').replaceWith(account_UserName.get('name'));
      }
    });
  },

  render: function() {
    var myAccountHtml = template("");
    this.$el.html(myAccountHtml);
    this.fetchUserName();
    return this;
  }
});
},{"../../../templates/myAccount.hbs":27,"../../Util/formValidation.js":1,"../models/Account_userName.js":4}],16:[function(require,module,exports){
var DrinkView = require('./DrinkView.js');
var SaveDrink = require('../models/SaveDrink.js');
var SavedItems = require('../models/SavedItems.js');

module.exports = Backbone.View.extend({
	tagName: 'div',


  events: {
    'click .recipeButton' : 'saveRecipe'
  },

  setLogin: function(login) {
    this.email = login;
  },

  saveRecipe: function(e){
    console.log('button triggered');
    if (this.email === undefined || this.email === ''){
      Backbone.history.navigate('/login', {trigger:true});
    }
    var inputDrink = this.$(e.currentTarget).parent().prev().find('.cocktailTitle').text().split('\n')[0];
    var saveDrink = new SaveDrink({
      drink: inputDrink.trim(),
      localEmail: this.email
    });

    saveDrink.save([], {
      dataType:'text',
      success: function(model, response){
        if (response === "Saved!"){
          this.$(e.currentTarget).attr('disabled', true);
          this.$(e.currentTarget).html('Saved!');
        }
        if (response === "Duplicate"){
          alert('Drink already in your list');
        }
      }
    });
  },

	renderLoggedIn: function() {
    var thiz = this;
    var savedItems = new SavedItems();

    savedItems.set({localEmail:thiz.email});

    savedItems.save([], {
      success: function(model, response){
        if (response.length !== 0){
          thiz.collection.each(function(drink){
            for (var each in response){
              if (response[each].name === drink.get('name')){
                var drinkView = new DrinkView({model:drink, match:true});
                break;
              }
              else{
                var drinkView = new DrinkView({model:drink, match:false});
              }
            }
            thiz.$el.append(drinkView.renderLoggedIn().el);
          },thiz);
        }
        else {
          thiz.renderNotLoggedIn();
        }
      }
    });
    return this;
	},

  renderNotLoggedIn: function() {
    this.collection.each(function(drink){
      var drinkView = new DrinkView({model:drink});
      this.$el.append(drinkView.renderNotLoggedIn().el);
    },this);
    return this;
  }

});
},{"../models/SaveDrink.js":9,"../models/SavedItems.js":10,"./DrinkView.js":17}],17:[function(require,module,exports){
module.exports = Backbone.View.extend({
  tagName: 'div',
  initialize: function(options) {
    this.options = options || {};
  },
  renderLoggedIn: function() {
    if (this.options.match === true){
      var template = require('../../../templates/resultsView_disabled.hbs');
      this.$el.html(template(this.model.toJSON()));
    }
    else{
      var template = require('../../../templates/resultsView.hbs');
      this.$el.html(template(this.model.toJSON()));
    }
    return this;
  },

  renderNotLoggedIn: function() {
    var template = require('../../../templates/resultsView.hbs');
    this.$el.html(template(this.model.toJSON()));
    return this;
  }

});
 
},{"../../../templates/resultsView.hbs":28,"../../../templates/resultsView_disabled.hbs":29}],18:[function(require,module,exports){
var template = require('../../../templates/firstQuestion.hbs');

module.exports = Backbone.View.extend({

  initialize: function() {
    this.render();
  },

  events: {
    'click #tag' : 'getTag'
  },

  getTag: function(e) {
    var tag = $(e.currentTarget).attr('class');
    this.$el.detach();
    Backbone.history.navigate( tag, { trigger:true } );
  },

  render: function() {
    var index = template(this.model.toJSON());
    this.$el.html(index);
    this.delegateEvents();
    return this;
  }

});

},{"../../../templates/firstQuestion.hbs":24}],19:[function(require,module,exports){
var template = require('../../../templates/index.hbs');

module.exports = Backbone.View.extend({
	tagName: 'div',
	className: 'page',
	initialize: function() {
		this.render();
	},

	render: function() {
		var index = template("");
		this.$el.html(index);
		return this;
	}

});


       
   
},{"../../../templates/index.hbs":25}],20:[function(require,module,exports){
var template = require('../../../templates/login.hbs');
var User= require('../models/User.js');

module.exports = Backbone.View.extend({

  initialize: function() {
    this.loggedIn = false;
    this.render();
  },

  events: {
    'click #login' : 'attemptLogin'
  },

  attemptLogin: function(e) {
    e.preventDefault();
    var thiz = this
    var email =  $(this.el).find('#emailInput').val();
    var password =  $(this.el).find('#passwordInput').val();
    var login = new User({localEmail:email, localPassword:password});
    this.model.set({localEmail:email});

    login.save([],{
      dataType:"text",
      success: function(model, response){
        if (response === "fail"){
          thiz.$('#badCredentials').html('wrong credentials');
        }
        else {
          $('#loggedInName').html(thiz.model.get('localEmail'));
          Backbone.history.navigate('/', {trigger:true});
        }
      },
      error: function(model, response){
        console.log(model, response);
      }
    });
  },

  render: function() {
    var loginHtml = template("");
    this.$el.html(loginHtml);
    return this;
  }

});
},{"../../../templates/login.hbs":26,"../models/User.js":13}],21:[function(require,module,exports){
var template = require('../../../templates/savedItems.hbs');
var SavedItems = require('../models/SavedItems.js');

module.exports = Backbone.View.extend({
  initialize: function() {
  },

  setLogin: function(login){
    this.email = login;
  },

  fetch: function() {
    var thiz = this;
    var savedItems = new SavedItems({localEmail:this.email});
    //using save here - could not pass payload with
    //fetch/get request
    savedItems.save(null, {
      success: function(model, response){
        thiz.databaseReturn = response;
        thiz.render();
      }
    });
  },

  render: function() {
    var thiz = this;
    var savedItemsHtml = template(thiz.databaseReturn);
    this.$el.html(savedItemsHtml);
    return this;
  }

});
},{"../../../templates/savedItems.hbs":30,"../models/SavedItems.js":10}],22:[function(require,module,exports){
var template = require('../../../templates/secondQuestion.hbs');

module.exports = Backbone.View.extend({

  initialize: function() {},

  events: {
    'click #ingredient' : 'getIngredient'
  },

  setTag: function(tag) {
    this.tag = tag;
  },

  getIngredient: function(e) {
    var ingredient = $(e.currentTarget).attr('class');
    this.$el.detach();
    Backbone.history.navigate( 'results/'+ this.tag +'/'+ ingredient, {trigger:true} );
  },

  render: function() {
    var index = template(this.model.toJSON());
    this.$el.html(index);
    this.delegateEvents();
    return this;
  }

});

},{"../../../templates/secondQuestion.hbs":31}],23:[function(require,module,exports){
var template = require('../../../templates/signup.hbs');
var SignUp = require('../models/SignUp.js');
var formValidation = require('../../Util/formValidation.js');

module.exports = Backbone.View.extend({
  initialize: function() {
    this.render();
  },

  events: {
    'click #signup' : 'signup',
    'click #Cancel' : 'cancel'
  },

  cancel: function(e){
    e.preventDefault();
    Backbone.history.navigate('/', {trigger:true});
  },

  signup: function(e) {
    e.preventDefault();
    var thiz = this;
    var name = $(this.el).find('#name').val();
    var email =  $(this.el).find('#emailInput').val();
    var password =  $(this.el).find('#passwordInput').val();
    var verifyPassword =  $(this.el).find('#verifyPassword').val();

    if (formValidation(name,email,password,verifyPassword)===false){
      return;
    }

    var signUp = new SignUp({
      name:name,
      localEmail:email,
      localPassword:password
    });

    signUp.save([],{
      dataType: 'text',
      success: function(model, response){
        if(response === 'This user already exists'){
          thiz.$('#signup').html('User already exists');
        }
        else{
          thiz.model.set({localEmail:email});

          $('#loggedInName').html(thiz.model.get('localEmail'));
          Backbone.history.navigate('/', {trigger:true});
        }
      }
    });

  },


  render: function() {
    var signupHtml = template("");
    this.$el.html(signupHtml);
    return this;
  }
});

},{"../../../templates/signup.hbs":32,"../../Util/formValidation.js":1,"../models/SignUp.js":12}],24:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">\n    <button id=\"tag\" class=";
  if (helper = helpers.tag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n";
  return buffer;
  }

  buffer += "<div class=\"row\">\n    <div class=\"question full large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.choices), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  });

},{"hbsfy/runtime":40}],25:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"off-canvas-wrap\">\n  <div class=\"inner-wrap\">\n    <nav class=\"tab-bar\">\n      <section class=\"left-small\">\n        <a class=\"left-off-canvas-toggle menu-icon\">\n          <span></span>\n        </a>\n      </section>\n      <section class=\"middle tab-bar-section\">\n        <a href=\"/\"><img id=\"logo\" src=\"../assets/images/toastie.png\"/></a>\n      </section>\n        <section class=\"right\">\n            <h2 id=\"loggedInName\"></h2>\n        </section>\n    </nav>\n    <aside class=\"left-off-canvas-menu\">\n      <ul class=\"off-canvas-list\">\n        <li><a href=\"#login\">Log in</a></li>\n        <li><a href=\"/logout\">Log out</a></li>\n        <li><a href=\"#myAccount\">My Account</a></li>\n        <li><a href=\"#savedItems\">Saved Items</a></li>\n      </ul>\n    </aside>\n    <i class=\"fa-menu\"></i>\n\n    <a class=\"exit-off-canvas\"></a>\n\n  <div class=Question></div>\n  <div class=Result></div>\n\n  </div>\n</div>\n";
  });

},{"hbsfy/runtime":40}],26:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <form class=\"loginForm\" action=\"/login\" method=\"post\">\n        <input id=\"emailInput\" name=\"email\" type=\"text\" placeholder=\"email\">\n        <input id=\"passwordInput\" name=\"password\" type=\"password\" placeholder=\"passwords\">\n        <a class=\"sub-line\" href=\"\">Forgot your password?</a>\n        <button id=\"login\" type=\"submit\">Sign-in</button>\n\n        \n            <div class=\"dividerWord small-1 large-1 medium-1 small-centered large-centered medium-centered columns\">or</div>\n           \n       \n\n    </form>\n    <div id=\"createAccount\" class=\"small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n        <a href=\"#signup\">Create an Account</a>\n    </div>\n    <h1 id=\"badCredentials\"></h1>\n</div>\n";
  });

},{"hbsfy/runtime":40}],27:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <h1>\n      Edit Account Info\n    </h1>\n    <h2 id=\"userName\"></h2>\n    <form  method=\"post\">\n        <h2>Verify Information</h2>\n        <input type=\"text\" class=\"form-control\" id=\"verifyEmail\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" id=\"verifyPassword\" name=\"password\" placeholder=\"password\">\n\n        <h2>New details</h2>\n        <input type=\"text\" class=\"form-control\" id=\"newName\" name=\"name\" placeholder=\"Name\">\n        <input type=\"text\" class=\"form-control\" id=\"newEmail\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" id=\"newPassword\" name=\"password\" placeholder=\"password\">\n        <input type=\"password\" class=\"form-control\" id=\"newPasswordVerify\" name=\"password\" placeholder=\"verify password\">\n        <button id=\"editInfo\">Edit</button>\n    </form>\n    <h1 id=\"errors\"></h1>\n</div>";
  });

},{"hbsfy/runtime":40}],28:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "        <div class=\"cocktailRecipeItem large-8 medium-8 small-12 large-centered medium-centered small-centered columns\">\n        <div id=\"fb-root\"></div>\n    <script>\n        window.fbAsyncInit = function() {\n            FB.init({\n                appId      : '{your-app-id}',\n                status     : true,\n                xfbml      : true\n            });\n        };\n\n        (function(d, s, id){\n            var js, fjs = d.getElementsByTagName(s)[0];\n            if (d.getElementById(id)) {return;}\n            js = d.createElement(s); js.id = id;\n            js.src = \"//connect.facebook.net/en_US/all.js\";\n            fjs.parentNode.insertBefore(js, fjs);\n        }(document, 'script', 'facebook-jssdk'));\n    </script>\n    <ul>\n        <li class=\"cocktailImage\">";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n\n        <li class=\"cocktailTitle\" property=\"og:title\" content=\"\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<div class=\"fb-share-button\" data-href=\"http://ianjohnson.co\" data-type=\"button\"></div>\n</li>\n\n        <li class=\"cocktailDescription\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"cocktailServing\">makes ";
  if (helper = helpers.servings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.servings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " servings</li>\n        <li>\n            <span class=\"titleRecipe\">Ingredients: </span>";
  if (helper = helpers.ingredients) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredients); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li>\n            <span class=\"titleRecipe\">Recipe: </span>";
  if (helper = helpers.directions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.directions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n    </ul>\n    <div class=\"large-4 medium-4 small-6 large-centered medium-centered small-centered columns\">\n        <button class=\"recipeButton\">Save Item</button>\n    </div>\n</div>\n";
  return buffer;
  });

},{"hbsfy/runtime":40}],29:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"cocktailRecipeItem large-8 medium-8 small-12 large-centered medium-centered small-centered columns\">\n\n    <div id=\"fb-root\"></div>\n    <script>\n        window.fbAsyncInit = function() {\n            FB.init({\n                appId      : '{your-app-id}',\n                status     : true,\n                xfbml      : true\n            });\n        };\n\n        (function(d, s, id){\n            var js, fjs = d.getElementsByTagName(s)[0];\n            if (d.getElementById(id)) {return;}\n            js = d.createElement(s); js.id = id;\n            js.src = \"//connect.facebook.net/en_US/all.js\";\n            fjs.parentNode.insertBefore(js, fjs);\n        }(document, 'script', 'facebook-jssdk'));\n    </script>\n\n    <ul>\n        <li class=\"cocktailImage\">";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"cocktailTitle\" property=\"og:title\" content=\"\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<div class=\"fb-share-button\" data-href=\"http://ianjohnson.co\" data-type=\"button\"></div>\n        </li>\n        <li class=\"cocktailDescription\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li class=\"cocktailServing\">makes ";
  if (helper = helpers.servings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.servings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " servings</li>\n        <li>\n            <span class=\"titleRecipe\">Ingredients: </span>";
  if (helper = helpers.ingredients) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredients); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        <li>\n            <span class=\"titleRecipe\">Recipe: </span>";
  if (helper = helpers.directions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.directions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n    </ul>\n    <div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns\">\n        <button class=\"recipeButton\" disabled>Already Saved</button>\n    </div>\n";
  return buffer;
  });

},{"hbsfy/runtime":40}],30:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n        <ul>\n            <li class=\"cocktailImage\">";
  if (helper = helpers.img) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.img); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li class=\"cocktailTitle\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li class=\"cocktailDescription\">";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li class=\"cocktailServing\">makes ";
  if (helper = helpers.servings) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.servings); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " servings</li>\n            <li><span class=\"titleRecipe\">Ingredients: </span>";
  if (helper = helpers.ingredients) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredients); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n            <li><span class=\"titleRecipe\">Recipe:</span> ";
  if (helper = helpers.directions) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.directions); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n        </ul>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <h1>Nothing to display - add items</h1>\n    ";
  }

  buffer += "<div class=\"cocktailRecipeItem large-8 medium-8 small-12 large-centered medium-centered small-centered columns\">\n\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n\n";
  return buffer;
  });

},{"hbsfy/runtime":40}],31:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n<div class=\"large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">\n    <button id=\"ingredient\" class=";
  if (helper = helpers.ingredient) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ingredient); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n";
  return buffer;
  }

  buffer += "<div class=\"row\">\n    <div class=\"question full large-8 medium-8 small-10 large-centered medium-centered small-centered columns text-center\">";
  if (helper = helpers.question) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.question); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</div>\n</div>\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.choices), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n\n\n\n\n\n";
  return buffer;
  });

},{"hbsfy/runtime":40}],32:[function(require,module,exports){
// hbsfy compiled Handlebars template
var Handlebars = require('hbsfy/runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"loginForm small-12 medium-8 large-8 small-centered medium-centered large-centered columns\">\n    <h1>\n        Create Account\n    </h1>\n    <form action=\"#signup\">\n        <input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" placeholder=\"Name\">\n        <input type=\"text\" class=\"form-control\" id=\"emailInput\" name=\"email\" placeholder=\"email\">\n        <input type=\"password\" class=\"form-control\" id=\"passwordInput\" name=\"password\" placeholder=\"password\">\n\n        <input type=\"password\" class=\"form-control\" id=\"verifyPassword\" name=\"password\" placeholder=\"confirm pasword\">    \n    </form>\n    <button id=\"signup\">Create Account</button>\n\n\n    <button id=\"Cancel\">Cancel</button>\n    <h1 id=\"errors\"></h1>\n</div>\n\n";
  });

},{"hbsfy/runtime":40}],33:[function(require,module,exports){
"use strict";
/*globals Handlebars: true */
var base = require("./handlebars/base");

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
var SafeString = require("./handlebars/safe-string")["default"];
var Exception = require("./handlebars/exception")["default"];
var Utils = require("./handlebars/utils");
var runtime = require("./handlebars/runtime");

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
var create = function() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;

  hb.VM = runtime;
  hb.template = function(spec) {
    return runtime.template(spec, hb);
  };

  return hb;
};

var Handlebars = create();
Handlebars.create = create;

exports["default"] = Handlebars;
},{"./handlebars/base":34,"./handlebars/exception":35,"./handlebars/runtime":36,"./handlebars/safe-string":37,"./handlebars/utils":38}],34:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];

var VERSION = "1.3.0";
exports.VERSION = VERSION;var COMPILER_REVISION = 4;
exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};
exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function(name, fn, inverse) {
    if (toString.call(name) === objectType) {
      if (inverse || fn) { throw new Exception('Arg not supported with multiple helpers'); }
      Utils.extend(this.helpers, name);
    } else {
      if (inverse) { fn.not = inverse; }
      this.helpers[name] = fn;
    }
  },

  registerPartial: function(name, str) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials,  name);
    } else {
      this.partials[name] = str;
    }
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function(arg) {
    if(arguments.length === 2) {
      return undefined;
    } else {
      throw new Exception("Missing helper: '" + arg + "'");
    }
  });

  instance.registerHelper('blockHelperMissing', function(context, options) {
    var inverse = options.inverse || function() {}, fn = options.fn;

    if (isFunction(context)) { context = context.call(this); }

    if(context === true) {
      return fn(this);
    } else if(context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if(context.length > 0) {
        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      return fn(context);
    }
  });

  instance.registerHelper('each', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var i = 0, ret = "", data;

    if (isFunction(context)) { context = context.call(this); }

    if (options.data) {
      data = createFrame(options.data);
    }

    if(context && typeof context === 'object') {
      if (isArray(context)) {
        for(var j = context.length; i<j; i++) {
          if (data) {
            data.index = i;
            data.first = (i === 0);
            data.last  = (i === (context.length-1));
          }
          ret = ret + fn(context[i], { data: data });
        }
      } else {
        for(var key in context) {
          if(context.hasOwnProperty(key)) {
            if(data) { 
              data.key = key; 
              data.index = i;
              data.first = (i === 0);
            }
            ret = ret + fn(context[key], {data: data});
            i++;
          }
        }
      }
    }

    if(i === 0){
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function(conditional, options) {
    if (isFunction(conditional)) { conditional = conditional.call(this); }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function(conditional, options) {
    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
  });

  instance.registerHelper('with', function(context, options) {
    if (isFunction(context)) { context = context.call(this); }

    if (!Utils.isEmpty(context)) return options.fn(context);
  });

  instance.registerHelper('log', function(context, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, context);
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 3,

  // can be overridden in the host environment
  log: function(level, obj) {
    if (logger.level <= level) {
      var method = logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};
exports.logger = logger;
function log(level, obj) { logger.log(level, obj); }

exports.log = log;var createFrame = function(object) {
  var obj = {};
  Utils.extend(obj, object);
  return obj;
};
exports.createFrame = createFrame;
},{"./exception":35,"./utils":38}],35:[function(require,module,exports){
"use strict";

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var line;
  if (node && node.firstLine) {
    line = node.firstLine;

    message += ' - ' + line + ':' + node.firstColumn;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (line) {
    this.lineNumber = line;
    this.column = node.firstColumn;
  }
}

Exception.prototype = new Error();

exports["default"] = Exception;
},{}],36:[function(require,module,exports){
"use strict";
var Utils = require("./utils");
var Exception = require("./exception")["default"];
var COMPILER_REVISION = require("./base").COMPILER_REVISION;
var REVISION_CHANGES = require("./base").REVISION_CHANGES;

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = REVISION_CHANGES[currentRevision],
          compilerVersions = REVISION_CHANGES[compilerRevision];
      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
    }
  }
}

exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial

function template(templateSpec, env) {
  if (!env) {
    throw new Exception("No environment passed to template");
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  var invokePartialWrapper = function(partial, name, context, helpers, partials, data) {
    var result = env.VM.invokePartial.apply(this, arguments);
    if (result != null) { return result; }

    if (env.compile) {
      var options = { helpers: helpers, partials: partials, data: data };
      partials[name] = env.compile(partial, { data: data !== undefined }, env);
      return partials[name](context, options);
    } else {
      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    }
  };

  // Just add water
  var container = {
    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,
    programs: [],
    program: function(i, fn, data) {
      var programWrapper = this.programs[i];
      if(data) {
        programWrapper = program(i, fn, data);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = program(i, fn);
      }
      return programWrapper;
    },
    merge: function(param, common) {
      var ret = param || common;

      if (param && common && (param !== common)) {
        ret = {};
        Utils.extend(ret, common);
        Utils.extend(ret, param);
      }
      return ret;
    },
    programWithDepth: env.VM.programWithDepth,
    noop: env.VM.noop,
    compilerInfo: null
  };

  return function(context, options) {
    options = options || {};
    var namespace = options.partial ? options : env,
        helpers,
        partials;

    if (!options.partial) {
      helpers = options.helpers;
      partials = options.partials;
    }
    var result = templateSpec.call(
          container,
          namespace, context,
          helpers,
          partials,
          options.data);

    if (!options.partial) {
      env.VM.checkRevision(container.compilerInfo);
    }

    return result;
  };
}

exports.template = template;function programWithDepth(i, fn, data /*, $depth */) {
  var args = Array.prototype.slice.call(arguments, 3);

  var prog = function(context, options) {
    options = options || {};

    return fn.apply(this, [context, options.data || data].concat(args));
  };
  prog.program = i;
  prog.depth = args.length;
  return prog;
}

exports.programWithDepth = programWithDepth;function program(i, fn, data) {
  var prog = function(context, options) {
    options = options || {};

    return fn(context, options.data || data);
  };
  prog.program = i;
  prog.depth = 0;
  return prog;
}

exports.program = program;function invokePartial(partial, name, context, helpers, partials, data) {
  var options = { partial: true, helpers: helpers, partials: partials, data: data };

  if(partial === undefined) {
    throw new Exception("The partial " + name + " could not be found");
  } else if(partial instanceof Function) {
    return partial(context, options);
  }
}

exports.invokePartial = invokePartial;function noop() { return ""; }

exports.noop = noop;
},{"./base":34,"./exception":35,"./utils":38}],37:[function(require,module,exports){
"use strict";
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = function() {
  return "" + this.string;
};

exports["default"] = SafeString;
},{}],38:[function(require,module,exports){
"use strict";
/*jshint -W004 */
var SafeString = require("./safe-string")["default"];

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr] || "&amp;";
}

function extend(obj, value) {
  for(var key in value) {
    if(Object.prototype.hasOwnProperty.call(value, key)) {
      obj[key] = value[key];
    }
  }
}

exports.extend = extend;var toString = Object.prototype.toString;
exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
var isFunction = function(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
if (isFunction(/x/)) {
  isFunction = function(value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
var isArray = Array.isArray || function(value) {
  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
};
exports.isArray = isArray;

function escapeExpression(string) {
  // don't escape SafeStrings, since they're already safe
  if (string instanceof SafeString) {
    return string.toString();
  } else if (!string && string !== 0) {
    return "";
  }

  // Force a string conversion as this will be done by the append regardless and
  // the regex test will do this transparently behind the scenes, causing issues if
  // an object's to string has escaped characters in it.
  string = "" + string;

  if(!possible.test(string)) { return string; }
  return string.replace(badChars, escapeChar);
}

exports.escapeExpression = escapeExpression;function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.isEmpty = isEmpty;
},{"./safe-string":37}],39:[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime');

},{"./dist/cjs/handlebars.runtime":33}],40:[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":39}]},{},[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL1V0aWwvZm9ybVZhbGlkYXRpb24uanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS9tYWluLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvbW9kZWxzL0FjY291bnQuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvQWNjb3VudF91c2VyTmFtZS5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL21vZGVscy9DaGVja1Nlc3Npb24uanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvRHJpbmsuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS9tb2RlbHMvRHJpbmtDb2xsZWN0aW9ucy5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL21vZGVscy9GaXJzdFF1ZXN0aW9uLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvbW9kZWxzL1NhdmVEcmluay5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL21vZGVscy9TYXZlZEl0ZW1zLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvbW9kZWxzL1NlY29uZFF1ZXN0aW9uLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvbW9kZWxzL1NpZ25VcC5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL21vZGVscy9Vc2VyLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvcm91dGVycy9Sb3V0ZXMuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9BY2NvdW50Vmlldy5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL3ZpZXdzL0RyaW5rQ29sbGVjdGlvbnNWaWV3LmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvdmlld3MvRHJpbmtWaWV3LmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvanMvYmFja2JvbmUvdmlld3MvRmlyc3RRdWVzdGlvblZpZXcuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9JbmRleFZpZXcuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9Mb2dpblZpZXcuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC9qcy9iYWNrYm9uZS92aWV3cy9TYXZlZEl0ZW1zVmlldy5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL3ZpZXdzL1NlY29uZFF1ZXN0aW9uVmlldy5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL2pzL2JhY2tib25lL3ZpZXdzL3NpZ251cFZpZXcuanMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC90ZW1wbGF0ZXMvZmlyc3RRdWVzdGlvbi5oYnMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC90ZW1wbGF0ZXMvaW5kZXguaGJzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvdGVtcGxhdGVzL2xvZ2luLmhicyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL3RlbXBsYXRlcy9teUFjY291bnQuaGJzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvdGVtcGxhdGVzL3Jlc3VsdHNWaWV3LmhicyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvYXBwL3RlbXBsYXRlcy9yZXN1bHRzVmlld19kaXNhYmxlZC5oYnMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC90ZW1wbGF0ZXMvc2F2ZWRJdGVtcy5oYnMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL2FwcC90ZW1wbGF0ZXMvc2Vjb25kUXVlc3Rpb24uaGJzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9hcHAvdGVtcGxhdGVzL3NpZ251cC5oYnMiLCIvVXNlcnMvaXJpcy9Eb2N1bWVudHMvTWl4b2xvZ3lBcHAtbWFzdGVyL25vZGVfbW9kdWxlcy9oYW5kbGViYXJzL2Rpc3QvY2pzL2hhbmRsZWJhcnMucnVudGltZS5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9iYXNlLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyIsIi9Vc2Vycy9pcmlzL0RvY3VtZW50cy9NaXhvbG9neUFwcC1tYXN0ZXIvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMvZGlzdC9janMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9kaXN0L2Nqcy9oYW5kbGViYXJzL3V0aWxzLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9ub2RlX21vZHVsZXMvaGFuZGxlYmFycy9ydW50aW1lLmpzIiwiL1VzZXJzL2lyaXMvRG9jdW1lbnRzL01peG9sb2d5QXBwLW1hc3Rlci9ub2RlX21vZHVsZXMvaGJzZnkvcnVudGltZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZvcm1WYWxpZGF0aW9uID0gZnVuY3Rpb24obmFtZSwgZW1haWwsIHBhc3N3b3JkLCB2ZXJpZnlQYXNzd29yZCkge1xuICAvL0VtYWlsIFZhbGlkYXRpb24gaW4gSmF2YVNjcmlwdCBodHRwOi8vd3d3Lm1hcmtldGluZ3RlY2hibG9nLmNvbS9qYXZhc2NyaXB0LXJlZ2V4LWVtYWlsYWRkcmVzcy8jaXh6ejJ5N3h2MVJIcVxuICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICBmdW5jdGlvbiBjaGVja0VtYWlsKGVtYWlsKXtcbiAgICB2YXIgcGF0dGVybj0vXihbYS16QS1aMC05Xy4tXSkrQChbYS16QS1aMC05Xy4tXSkrXFwuKFthLXpBLVpdKSsoW2EtekEtWl0pKy87XG4gICAgaWYocGF0dGVybi50ZXN0KGVtYWlsKSl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9ZWxzZXtcbiAgICAgICQoJyNlcnJvcnMnKS5odG1sKCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIEVtYWlsJyk7XG4vLyAgICAgIGFsZXJ0KCdQbGVhc2UgcHJvdmlkZSBhIHZhbGlkIEVtYWlsJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGlmKG5hbWU9PT0nJ3x8IGVtYWlsPT09JycgfHwgcGFzc3dvcmQ9PT0nJ3x8IHZlcmlmeVBhc3N3b3JkPT09Jycpe1xuICAgICQoJyNlcnJvcnMnKS5odG1sKCdPbmUgb2YgeW91ciBmaWVsZHMgaGF2ZSBub3QgYmVlbiBmaWxsZWQnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYocGFzc3dvcmQhPT12ZXJpZnlQYXNzd29yZCl7XG4gICAgJCgnI2Vycm9ycycpLmh0bWwoJ1lvdXIgcGFzc3dvcmRzIGRvblxcJ3QgbWF0Y2gnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYoY2hlY2tFbWFpbChlbWFpbCk9PT1mYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JtVmFsaWRhdGlvbjsiLCJ2YXIgUm91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXJzL1JvdXRlcy5qcycpO1xuXG4kKGZ1bmN0aW9uKCkge1xuXHR2YXIgcm91dGVzID0gbmV3IFJvdXRlcygpO1xuXHRCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcIi9lZGl0L1wiLFxuXHRkZWZhdWx0czoge1xuICAgIHZlcmlmeUVtYWlsOiBcIlwiLFxuICAgIHZlcmlmeVBhc3N3b3JkOiBcIlwiLFxuICAgIG5ld05hbWU6IFwiXCIsXG4gICAgbmV3RW1haWw6IFwiXCIsXG4gICAgbmV3UGFzc3dvcmQ6IFwiXCIsXG5cdH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICB1cmw6IFwiL2dldE5hbWUvXCIsXG5cdGRlZmF1bHRzOiB7XG4gICAgbmFtZTogJydcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCIvY2hlY2tTZXNzaW9uL1wiLFxuXHRkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWw6IFwiXCJcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG5cdGRlZmF1bHRzOiB7XG4gICAgbmFtZTogXCJcIixcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbmdyZWRpZW50czogXCJcIixcblx0XHRkaXJlY3Rpb25zOiBcIlwiLFxuXHRcdHRhZzogXCJcIixcblx0XHRzZXJ2aW5nczogXCJcIixcblx0XHRpbWc6IFwiXCJcblx0fVxufSk7XG4iLCJ2YXIgRHJpbmsgPSByZXF1aXJlKCcuL0RyaW5rLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuXHRcdHRoaXMuaW5ncmVkaWVudCA9IG9wdGlvbnMuaW5ncmVkaWVudDtcblx0XHR0aGlzLnRhZyA9IG9wdGlvbnMudGFnO1xuXHRcdHRoaXMudXJsID0gJy9hcGkvdjEvZ2V0RHJpbmsvJyt0aGlzLnRhZysnLycrdGhpcy5pbmdyZWRpZW50O1xuXHR9LFxuXG5cdG1vZGVsOiBEcmlua1xuXG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0dXJsOiBcIi9hcGkvdjEvZ2V0Rmlyc3RRdWVzdGlvbi9cIixcblx0ZGVmYXVsdHM6IHtcblx0XHRcInF1ZXN0aW9uXCIgOiBcIlwiLFxuXHRcdFwiY2hvaWNlc1wiIDogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIlwiLFxuXHRcdFx0XHRcInRhZ1wiIDogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJsYWJlbFwiIDogXCJcIixcblx0XHRcdFx0XCJ0YWdcIiA6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIiA6IFwiXCIsXG5cdFx0XHRcdFwidGFnXCIgOiBcIlwiXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcInJhbmRvbVwiIDogXCJcIlxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcIi9zYXZlRHJpbmsvXCIsXG5cdGRlZmF1bHRzOiB7XG4gICAgbG9jYWxFbWFpbDogXCJcIixcbiAgICBkcmluazogXCJcIlxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgdXJsOiBcIi9nZXRTYXZlZEl0ZW1zL1wiLFxuXHRkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWw6ICcnLFxuICAgIHNhdmVkRHJpbmtzOiBbXVxuXHR9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0dXJsOiBcIi9hcGkvdjEvZ2V0U2Vjb25kUXVlc3Rpb24vXCIsXG5cdGRlZmF1bHRzOiB7XG5cdFx0XCJxdWVzdGlvblwiIDogXCJcIixcblx0XHRcImNob2ljZXNcIiA6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJsYWJlbFwiIDogXCJcIixcblx0XHRcdFx0XCJ0YWdcIiA6IFwiXCJcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwibGFiZWxcIiA6IFwiXCIsXG5cdFx0XHRcdFwidGFnXCIgOiBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImxhYmVsXCIgOiBcIlwiLFxuXHRcdFx0XHRcInRhZ1wiIDogXCJcIlxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJyYW5kb21cIiA6IFwiXCJcblx0fVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCIvc2lnbnVwL1wiLFxuICBkZWZhdWx0czoge1xuICAgIGxvY2FsRW1haWwgICAgICAgOiAnJyxcbiAgICBsb2NhbFBhc3N3b3JkICAgIDogJydcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIHVybDogXCIvbG9naW4vXCIsXG4gIGRlZmF1bHRzOiB7XG4gICAgbG9jYWxFbWFpbCAgICAgICA6ICcnLFxuICAgIGxvY2FsUGFzc3dvcmQgICAgOiAnJyxcbiAgICB0d2l0dGVySWQgICAgICAgICAgOiAnJyxcbiAgICB0d2l0dGVyVG9rZW4gICAgICAgOiAnJyxcbiAgICB0d2l0dGVyRGlzcGxheU5hbWUgOiAnJyxcbiAgICB0d2l0dGVyVXNlck5hbWUgICAgOiAnJyxcbiAgICBzYXZlZERyaW5rcyAgICAgICAgOiBbXVxuICB9XG59KTtcbiIsInZhciBEcmluayA9IHJlcXVpcmUoJy4uL21vZGVscy9Ecmluay5qcycpO1xudmFyIERyaW5rQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uL21vZGVscy9Ecmlua0NvbGxlY3Rpb25zLmpzJyk7XG52YXIgRHJpbmtDb2xsZWN0aW9uc1ZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9Ecmlua0NvbGxlY3Rpb25zVmlldy5qcycpO1xudmFyIEZpcnN0UXVlc3Rpb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvRmlyc3RRdWVzdGlvbi5qcycpO1xudmFyIFNlY29uZFF1ZXN0aW9uID0gcmVxdWlyZSgnLi4vbW9kZWxzL1NlY29uZFF1ZXN0aW9uLmpzJyk7XG52YXIgRmlyc3RRdWVzdGlvblZpZXcgPSByZXF1aXJlKCcuLi92aWV3cy9GaXJzdFF1ZXN0aW9uVmlldy5qcycpO1xudmFyIFNlY29uZFF1ZXN0aW9uVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL1NlY29uZFF1ZXN0aW9uVmlldy5qcycpO1xudmFyIEluZGV4VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0luZGV4Vmlldy5qcycpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9tb2RlbHMvVXNlci5qcycpO1xudmFyIExvZ2luVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0xvZ2luVmlldy5qcycpO1xudmFyIFNhdmVkSXRlbXNWaWV3ID0gcmVxdWlyZSgnLi4vdmlld3MvU2F2ZWRJdGVtc1ZpZXcuanMnKTtcbnZhciBDaGVja1Nlc3Npb24gPSByZXF1aXJlKCcuLi9tb2RlbHMvQ2hlY2tTZXNzaW9uLmpzJyk7XG52YXIgU2lnbnVwVmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL3NpZ251cFZpZXcuanMnKTtcbnZhciBBY2NvdW50ID0gcmVxdWlyZSgnLi4vbW9kZWxzL0FjY291bnQuanMnKTtcbnZhciBBY2NvdW50VmlldyA9IHJlcXVpcmUoJy4uL3ZpZXdzL0FjY291bnRWaWV3LmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG5cbiAgcm91dGVzOiB7XG4gICAgXCJteUFjY291bnRcIjpcInNob3dNeUFjY291bnRQYWdlXCIsXG4gICAgXCJzYXZlZEl0ZW1zXCI6IFwic2hvd1NhdmVkSXRlbXNcIixcbiAgICBcInNpZ251cFwiOlwic2hvd1NpZ251cFBhZ2VcIixcbiAgICBcImxvZ2luXCI6IFwic2hvd0xvZ2luUGFnZVwiLFxuICAgIFwiXCI6IFwic2hvd0ZpcnN0UXVlc3Rpb25cIixcbiAgICBcIjp0YWdcIjogJ3Nob3dTZWNvbmRRdWVzdGlvbicsXG4gICAgXCJyZXN1bHRzLzp0YWcvOmluZ3JlZGllbnRcIjogXCJnZXRSZXN1bHRzXCJcblxuICB9LFxuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnaW5pdGlhbGl6ZWQnKTtcbiAgICB0aGlzLmNoZWNrU2Vzc2lvbigpO1xuICAgIHZhciB0aGl6ID0gdGhpcztcblxuICAgIHRoaXMubG9naW4gPSBuZXcgVXNlcigpO1xuICAgIHRoaXMuY2hlY2tTZXNzaW9uKCk7XG5cbiAgICB2YXIgaW5kZXhWaWV3O1xuICAgIGluZGV4VmlldyA9IG5ldyBJbmRleFZpZXcoe1xuICAgICAgbW9kZWw6IHt9XG4gICAgfSk7XG4gICAgJCgnI2NvbnRlbnQnKS5hcHBlbmQoaW5kZXhWaWV3LmVsKTtcbiAgICB0aGlzLmZpcnN0UXVlc3Rpb24gPSBuZXcgRmlyc3RRdWVzdGlvbigpO1xuICAgIHRoaXMuZmlyc3RRdWVzdGlvblZpZXcgPSBuZXcgRmlyc3RRdWVzdGlvblZpZXcoe1xuICAgICAgbW9kZWw6IHRoaXMuZmlyc3RRdWVzdGlvblxuICAgIH0pO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmZpcnN0UXVlc3Rpb24uZmV0Y2goe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGF0LmZpcnN0UXVlc3Rpb25WaWV3LnJlbmRlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuc2Vjb25kUXVlc3Rpb24gPSBuZXcgU2Vjb25kUXVlc3Rpb24oKTtcbiAgICB0aGlzLnNlY29uZFF1ZXN0aW9uLmZldGNoKCk7XG5cbiAgfSxcblxuICBjaGVja1Nlc3Npb246IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICB2YXIgY2hlY2tTZXNzaW9uID0gbmV3IENoZWNrU2Vzc2lvbigpO1xuICAgIGNoZWNrU2Vzc2lvbi5mZXRjaCh7XG4gICAgICBkYXRhVHlwZTondGV4dCcsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihtb2RlbCwgcmVzcG9uc2Upe1xuICAgICAgICB0aGl6LmxvZ2luLnNldCh7bG9jYWxFbWFpbDpyZXNwb25zZX0pO1xuICAgICAgICAkKCcjbG9nZ2VkSW5OYW1lJykuaHRtbCh0aGl6LmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBzaG93U2F2ZWRJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNhdmVkSXRlbXNWaWV3ID0gbmV3IFNhdmVkSXRlbXNWaWV3KCk7XG5cbiAgICBpZiAodGhpcy5sb2dpbi5nZXQoJ2xvY2FsRW1haWwnKSA9PT0gJycpe1xuICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnL2xvZ2luJywge3RyaWdnZXI6dHJ1ZX0pXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBzYXZlZEl0ZW1zVmlldy5zZXRMb2dpbih0aGlzLmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgIHNhdmVkSXRlbXNWaWV3LmZldGNoKCk7XG4gICAgICAkKCcuUXVlc3Rpb24nKS5lbXB0eSgpO1xuICAgICAgJCgnLlJlc3VsdCcpLmVtcHR5KCk7XG4gICAgICAkKCcuUmVzdWx0JykuYXBwZW5kKHNhdmVkSXRlbXNWaWV3LmVsKTtcbiAgICB9XG5cbiAgfSxcblxuICBzaG93TG9naW5QYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvZ2luVmlldyA9IG5ldyBMb2dpblZpZXcoe21vZGVsOnRoaXMubG9naW59KTtcbiAgICAkKCcuUXVlc3Rpb24nKS5lbXB0eSgpO1xuICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICQoJy5SZXN1bHQnKS5hcHBlbmQobG9naW5WaWV3LmVsKTtcbiAgfSxcbiAgc2hvd1NpZ251cFBhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2lnbnVwVmlldyA9IG5ldyBTaWdudXBWaWV3KHttb2RlbDp0aGlzLmxvZ2lufSk7XG4gICAgJCgnLlF1ZXN0aW9uJykuZW1wdHkoKTtcbiAgICAkKCcuUmVzdWx0JykuZW1wdHkoKTtcbiAgICAkKCcuUmVzdWx0JykuYXBwZW5kKHNpZ251cFZpZXcuZWwpO1xuICB9LFxuICBzaG93TXlBY2NvdW50UGFnZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmxvZ2luLmdldCgnbG9jYWxFbWFpbCcpID09PSAnJyl7XG4gICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCcvbG9naW4nLCB7dHJpZ2dlcjp0cnVlfSlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIHZhciBhY2NvdW50ID0gbmV3IEFjY291bnQoKTtcbiAgICAgIHZhciBhY2NvdW50VmlldyA9IG5ldyBBY2NvdW50Vmlldyh7bW9kZWw6YWNjb3VudCwgbG9naW46dGhpcy5sb2dpbn0pO1xuICAgICAgJCgnLlF1ZXN0aW9uJykuZW1wdHkoKTtcbiAgICAgICQoJy5SZXN1bHQnKS5lbXB0eSgpO1xuICAgICAgJCgnLlJlc3VsdCcpLmFwcGVuZChhY2NvdW50Vmlldy5lbCk7XG4gICAgfVxuICB9LFxuXG4gIHNob3dGaXJzdFF1ZXN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jaGVja1Nlc3Npb24oKTtcbiAgICAkKCcuUmVzdWx0JykuZW1wdHkoKTtcbiAgICB0aGlzLmZpcnN0UXVlc3Rpb25WaWV3LnJlbmRlcigpO1xuICAgICQoJy5RdWVzdGlvbicpLmh0bWwodGhpcy5maXJzdFF1ZXN0aW9uVmlldy5lbCk7XG4gIH0sXG5cbiAgc2hvd1NlY29uZFF1ZXN0aW9uOiBmdW5jdGlvbiAodGFnKSB7XG4gICAgdGhpcy5jaGVja1Nlc3Npb24oKTtcbiAgICB0aGlzLnNlY29uZFF1ZXN0aW9uVmlldyA9IG5ldyBTZWNvbmRRdWVzdGlvblZpZXcoe1xuICAgICAgbW9kZWw6IHRoaXMuc2Vjb25kUXVlc3Rpb25cbiAgICB9KTtcbiAgICB0aGlzLnNlY29uZFF1ZXN0aW9uVmlldy5yZW5kZXIoKTtcbiAgICB0aGlzLnNlY29uZFF1ZXN0aW9uVmlldy5zZXRUYWcodGFnKTtcbiAgICAkKCcuUmVzdWx0JykuZW1wdHkoKTtcbiAgICAkKCcuUXVlc3Rpb24nKS5odG1sKHRoaXMuc2Vjb25kUXVlc3Rpb25WaWV3LmVsKTtcbiAgfSxcblxuICBnZXRSZXN1bHRzOiBmdW5jdGlvbiAodGFnLCBpbmdyZWRpZW50KSB7XG4gICAgdGhpcy5jaGVja1Nlc3Npb24oKTtcbiAgICB2YXIgdGhpeiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gcmVuZGVyRHJpbmtDb2xsZWN0aW9uKCkge1xuICAgICAgdmFyIGRyaW5rQ29sbGVjdGlvbnNWaWV3ID0gbmV3IERyaW5rQ29sbGVjdGlvbnNWaWV3KHtcbiAgICAgICAgY29sbGVjdGlvbjogZHJpbmtDb2xsZWN0aW9uXG4gICAgICB9KTtcblxuICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhpcyBoYXMgYmVlbiBzZXRcblxuICAgICAgaWYgKHRoaXoubG9naW4uZ2V0KCdsb2NhbEVtYWlsJykgPT09ICcnKXtcbiAgICAgICAgZHJpbmtDb2xsZWN0aW9uc1ZpZXcucmVuZGVyTm90TG9nZ2VkSW4oKTtcbiAgICAgICAgJCgnLlF1ZXN0aW9uJykuZW1wdHkoKTtcbiAgICAgICAgJCgnLlJlc3VsdCcpLmh0bWwoZHJpbmtDb2xsZWN0aW9uc1ZpZXcuZWwpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZHJpbmtDb2xsZWN0aW9uc1ZpZXcuc2V0TG9naW4odGhpei5sb2dpbi5nZXQoJ2xvY2FsRW1haWwnKSk7XG4gICAgICAgIGRyaW5rQ29sbGVjdGlvbnNWaWV3LnJlbmRlckxvZ2dlZEluKCk7XG4gICAgICAgICQoJy5RdWVzdGlvbicpLmVtcHR5KCk7XG4gICAgICAgICQoJy5SZXN1bHQnKS5odG1sKGRyaW5rQ29sbGVjdGlvbnNWaWV3LmVsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGRyaW5rQ29sbGVjdGlvbiA9IG5ldyBEcmlua0NvbGxlY3Rpb24oW10sIHtcbiAgICAgIHRhZzogdGFnLFxuICAgICAgaW5ncmVkaWVudDogaW5ncmVkaWVudFxuICAgIH0pO1xuICAgIGRyaW5rQ29sbGVjdGlvbi5mZXRjaCh7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgcmVuZGVyRHJpbmtDb2xsZWN0aW9uKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufSk7XG4iLCJ2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvbXlBY2NvdW50LmhicycpO1xudmFyIGZvcm1WYWxpZGF0aW9uID0gcmVxdWlyZSgnLi4vLi4vVXRpbC9mb3JtVmFsaWRhdGlvbi5qcycpO1xudmFyIEFjY291bnRfdXNlck5hbWUgPSByZXF1aXJlKCcuLi9tb2RlbHMvQWNjb3VudF91c2VyTmFtZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfSxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgI2VkaXRJbmZvJyA6ICdlZGl0SW5mbydcbiAgfSxcblxuICBlZGl0SW5mbzogZnVuY3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICB2YXIgdmVyaWZ5RW1haWwgPSAkKHRoaXMuZWwpLmZpbmQoJyN2ZXJpZnlFbWFpbCcpLnZhbCgpO1xuICAgIHZhciB2ZXJpZnlQYXNzd29yZCA9ICQodGhpcy5lbCkuZmluZCgnI3ZlcmlmeVBhc3N3b3JkJykudmFsKCk7XG4gICAgdmFyIG5ld05hbWUgPSAkKHRoaXMuZWwpLmZpbmQoJyNuZXdOYW1lJykudmFsKCk7XG4gICAgdmFyIG5ld0VtYWlsID0gJCh0aGlzLmVsKS5maW5kKCcjbmV3RW1haWwnKS52YWwoKTtcbiAgICB2YXIgbmV3UGFzc3dvcmQgPSAkKHRoaXMuZWwpLmZpbmQoJyNuZXdQYXNzd29yZCcpLnZhbCgpO1xuICAgIHZhciBuZXdQYXNzd29yZFZlcmlmeSA9ICQodGhpcy5lbCkuZmluZCgnI25ld1Bhc3N3b3JkVmVyaWZ5JykudmFsKCk7XG5cbiAgICBpZiAoZm9ybVZhbGlkYXRpb24obmV3TmFtZSxuZXdFbWFpbCxuZXdQYXNzd29yZCxuZXdQYXNzd29yZFZlcmlmeSk9PT1mYWxzZSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgdmVyaWZ5RW1haWw6IHZlcmlmeUVtYWlsLFxuICAgICAgdmVyaWZ5UGFzc3dvcmQ6IHZlcmlmeVBhc3N3b3JkLFxuICAgICAgbmV3TmFtZTogbmV3TmFtZSxcbiAgICAgIG5ld0VtYWlsOiBuZXdFbWFpbCxcbiAgICAgIG5ld1Bhc3N3b3JkOiBuZXdQYXNzd29yZFxuICAgIH0pO1xuXG4gICAgdGhpcy5tb2RlbC5zYXZlKFtdLCB7XG4gICAgICBkYXRhVHlwZTondGV4dCcsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihtb2RlbCwgcmVzcG9uc2Upe1xuICAgICAgICBpZiAocmVzcG9uc2UgPT09ICdVcGRhdGUgb2shJyl7XG4gICAgICAgICAgYWxlcnQoJ0FjY291bnQgZGV0YWlscyBjaGFuZ2VkIScpO1xuICAgICAgICAgIHRoaXoub3B0aW9ucy5sb2dpbi5zZXQoe2xvY2FsRW1haWw6bmV3RW1haWwudG9Mb3dlckNhc2UoKX0pO1xuICAgICAgICAgICQoJyNsb2dnZWRJbk5hbWUnKS5odG1sKG5ld0VtYWlsKTtcbiAgICAgICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCcvJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIGlmKHJlc3BvbnNlID09PSAnV3JvbmcgcGFzc3dvcmQhJyl7XG4gICAgICAgICAgJCgnI2Vycm9ycycpLmh0bWwoJ1dyb25nIHZlcmlmaWNhdGlvbiBwYXNzd29yZCBwcm92aWRlZCEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZihyZXNwb25zZSA9PT0gJ1dyb25nIGVtYWlsIScpe1xuICAgICAgICAgICQoJyNlcnJvcnMnKS5odG1sKCdXcm9uZyB2ZXJpZmljYXRpb24gZW1haWwgcHJvdmlkZWQhJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYocmVzcG9uc2UgPT09ICdUaGUgbmV3IGVtYWlsIHlvdSBlbnRlcmVkIGFscmVhZHkgZXhpc3RzIScpe1xuICAgICAgICAgICQoJyNlcnJvcnMnKS5odG1sKCdUaGUgbmV3IGVtYWlsIHlvdSBlbnRlcmVkIGFscmVhZHkgZXhpc3RzIScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBmZXRjaFVzZXJOYW1lOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudF9Vc2VyTmFtZSA9IG5ldyBBY2NvdW50X3VzZXJOYW1lKCk7XG4gICAgYWNjb3VudF9Vc2VyTmFtZS5mZXRjaCh7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiQoJyN1c2VyTmFtZScpLnJlcGxhY2VXaXRoKGFjY291bnRfVXNlck5hbWUuZ2V0KCduYW1lJykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG15QWNjb3VudEh0bWwgPSB0ZW1wbGF0ZShcIlwiKTtcbiAgICB0aGlzLiRlbC5odG1sKG15QWNjb3VudEh0bWwpO1xuICAgIHRoaXMuZmV0Y2hVc2VyTmFtZSgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTsiLCJ2YXIgRHJpbmtWaWV3ID0gcmVxdWlyZSgnLi9Ecmlua1ZpZXcuanMnKTtcbnZhciBTYXZlRHJpbmsgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2F2ZURyaW5rLmpzJyk7XG52YXIgU2F2ZWRJdGVtcyA9IHJlcXVpcmUoJy4uL21vZGVscy9TYXZlZEl0ZW1zLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2JyxcblxuXG4gIGV2ZW50czoge1xuICAgICdjbGljayAucmVjaXBlQnV0dG9uJyA6ICdzYXZlUmVjaXBlJ1xuICB9LFxuXG4gIHNldExvZ2luOiBmdW5jdGlvbihsb2dpbikge1xuICAgIHRoaXMuZW1haWwgPSBsb2dpbjtcbiAgfSxcblxuICBzYXZlUmVjaXBlOiBmdW5jdGlvbihlKXtcbiAgICBjb25zb2xlLmxvZygnYnV0dG9uIHRyaWdnZXJlZCcpO1xuICAgIGlmICh0aGlzLmVtYWlsID09PSB1bmRlZmluZWQgfHwgdGhpcy5lbWFpbCA9PT0gJycpe1xuICAgICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnL2xvZ2luJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgIH1cbiAgICB2YXIgaW5wdXREcmluayA9IHRoaXMuJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpLnByZXYoKS5maW5kKCcuY29ja3RhaWxUaXRsZScpLnRleHQoKS5zcGxpdCgnXFxuJylbMF07XG4gICAgdmFyIHNhdmVEcmluayA9IG5ldyBTYXZlRHJpbmsoe1xuICAgICAgZHJpbms6IGlucHV0RHJpbmsudHJpbSgpLFxuICAgICAgbG9jYWxFbWFpbDogdGhpcy5lbWFpbFxuICAgIH0pO1xuXG4gICAgc2F2ZURyaW5rLnNhdmUoW10sIHtcbiAgICAgIGRhdGFUeXBlOid0ZXh0JyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJTYXZlZCFcIil7XG4gICAgICAgICAgdGhpcy4kKGUuY3VycmVudFRhcmdldCkuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICB0aGlzLiQoZS5jdXJyZW50VGFyZ2V0KS5odG1sKCdTYXZlZCEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzcG9uc2UgPT09IFwiRHVwbGljYXRlXCIpe1xuICAgICAgICAgIGFsZXJ0KCdEcmluayBhbHJlYWR5IGluIHlvdXIgbGlzdCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cblx0cmVuZGVyTG9nZ2VkSW46IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICB2YXIgc2F2ZWRJdGVtcyA9IG5ldyBTYXZlZEl0ZW1zKCk7XG5cbiAgICBzYXZlZEl0ZW1zLnNldCh7bG9jYWxFbWFpbDp0aGl6LmVtYWlsfSk7XG5cbiAgICBzYXZlZEl0ZW1zLnNhdmUoW10sIHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGggIT09IDApe1xuICAgICAgICAgIHRoaXouY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRyaW5rKXtcbiAgICAgICAgICAgIGZvciAodmFyIGVhY2ggaW4gcmVzcG9uc2Upe1xuICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbZWFjaF0ubmFtZSA9PT0gZHJpbmsuZ2V0KCduYW1lJykpe1xuICAgICAgICAgICAgICAgIHZhciBkcmlua1ZpZXcgPSBuZXcgRHJpbmtWaWV3KHttb2RlbDpkcmluaywgbWF0Y2g6dHJ1ZX0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdmFyIGRyaW5rVmlldyA9IG5ldyBEcmlua1ZpZXcoe21vZGVsOmRyaW5rLCBtYXRjaDpmYWxzZX0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGl6LiRlbC5hcHBlbmQoZHJpbmtWaWV3LnJlbmRlckxvZ2dlZEluKCkuZWwpO1xuICAgICAgICAgIH0sdGhpeik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpei5yZW5kZXJOb3RMb2dnZWRJbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG5cdH0sXG5cbiAgcmVuZGVyTm90TG9nZ2VkSW46IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY29sbGVjdGlvbi5lYWNoKGZ1bmN0aW9uKGRyaW5rKXtcbiAgICAgIHZhciBkcmlua1ZpZXcgPSBuZXcgRHJpbmtWaWV3KHttb2RlbDpkcmlua30pO1xuICAgICAgdGhpcy4kZWwuYXBwZW5kKGRyaW5rVmlldy5yZW5kZXJOb3RMb2dnZWRJbigpLmVsKTtcbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICB0YWdOYW1lOiAnZGl2JyxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIH0sXG4gIHJlbmRlckxvZ2dlZEluOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLm1hdGNoID09PSB0cnVlKXtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9yZXN1bHRzVmlld19kaXNhYmxlZC5oYnMnKTtcbiAgICAgIHRoaXMuJGVsLmh0bWwodGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSkpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgdmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3Jlc3VsdHNWaWV3LmhicycpO1xuICAgICAgdGhpcy4kZWwuaHRtbCh0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHJlbmRlck5vdExvZ2dlZEluOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvcmVzdWx0c1ZpZXcuaGJzJyk7XG4gICAgdGhpcy4kZWwuaHRtbCh0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufSk7XG4gIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL2ZpcnN0UXVlc3Rpb24uaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrICN0YWcnIDogJ2dldFRhZydcbiAgfSxcblxuICBnZXRUYWc6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGFnID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2NsYXNzJyk7XG4gICAgdGhpcy4kZWwuZGV0YWNoKCk7XG4gICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSggdGFnLCB7IHRyaWdnZXI6dHJ1ZSB9ICk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5kZXggPSB0ZW1wbGF0ZSh0aGlzLm1vZGVsLnRvSlNPTigpKTtcbiAgICB0aGlzLiRlbC5odG1sKGluZGV4KTtcbiAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufSk7XG4iLCJ2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvaW5kZXguaGJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuXHR0YWdOYW1lOiAnZGl2Jyxcblx0Y2xhc3NOYW1lOiAncGFnZScsXG5cdGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucmVuZGVyKCk7XG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgaW5kZXggPSB0ZW1wbGF0ZShcIlwiKTtcblx0XHR0aGlzLiRlbC5odG1sKGluZGV4KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG59KTtcblxuXG4gICAgICAgXG4gICAiLCJ2YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuLi8uLi8uLi90ZW1wbGF0ZXMvbG9naW4uaGJzJyk7XG52YXIgVXNlcj0gcmVxdWlyZSgnLi4vbW9kZWxzL1VzZXIuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2dnZWRJbiA9IGZhbHNlO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH0sXG5cbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrICNsb2dpbicgOiAnYXR0ZW1wdExvZ2luJ1xuICB9LFxuXG4gIGF0dGVtcHRMb2dpbjogZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgdGhpeiA9IHRoaXNcbiAgICB2YXIgZW1haWwgPSAgJCh0aGlzLmVsKS5maW5kKCcjZW1haWxJbnB1dCcpLnZhbCgpO1xuICAgIHZhciBwYXNzd29yZCA9ICAkKHRoaXMuZWwpLmZpbmQoJyNwYXNzd29yZElucHV0JykudmFsKCk7XG4gICAgdmFyIGxvZ2luID0gbmV3IFVzZXIoe2xvY2FsRW1haWw6ZW1haWwsIGxvY2FsUGFzc3dvcmQ6cGFzc3dvcmR9KTtcbiAgICB0aGlzLm1vZGVsLnNldCh7bG9jYWxFbWFpbDplbWFpbH0pO1xuXG4gICAgbG9naW4uc2F2ZShbXSx7XG4gICAgICBkYXRhVHlwZTpcInRleHRcIixcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJmYWlsXCIpe1xuICAgICAgICAgIHRoaXouJCgnI2JhZENyZWRlbnRpYWxzJykuaHRtbCgnd3JvbmcgY3JlZGVudGlhbHMnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAkKCcjbG9nZ2VkSW5OYW1lJykuaHRtbCh0aGl6Lm1vZGVsLmdldCgnbG9jYWxFbWFpbCcpKTtcbiAgICAgICAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCcvJywge3RyaWdnZXI6dHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vZGVsLCByZXNwb25zZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbG9naW5IdG1sID0gdGVtcGxhdGUoXCJcIik7XG4gICAgdGhpcy4kZWwuaHRtbChsb2dpbkh0bWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pOyIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9zYXZlZEl0ZW1zLmhicycpO1xudmFyIFNhdmVkSXRlbXMgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2F2ZWRJdGVtcy5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gIH0sXG5cbiAgc2V0TG9naW46IGZ1bmN0aW9uKGxvZ2luKXtcbiAgICB0aGlzLmVtYWlsID0gbG9naW47XG4gIH0sXG5cbiAgZmV0Y2g6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGl6ID0gdGhpcztcbiAgICB2YXIgc2F2ZWRJdGVtcyA9IG5ldyBTYXZlZEl0ZW1zKHtsb2NhbEVtYWlsOnRoaXMuZW1haWx9KTtcbiAgICAvL3VzaW5nIHNhdmUgaGVyZSAtIGNvdWxkIG5vdCBwYXNzIHBheWxvYWQgd2l0aFxuICAgIC8vZmV0Y2gvZ2V0IHJlcXVlc3RcbiAgICBzYXZlZEl0ZW1zLnNhdmUobnVsbCwge1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlKXtcbiAgICAgICAgdGhpei5kYXRhYmFzZVJldHVybiA9IHJlc3BvbnNlO1xuICAgICAgICB0aGl6LnJlbmRlcigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuICAgIHZhciBzYXZlZEl0ZW1zSHRtbCA9IHRlbXBsYXRlKHRoaXouZGF0YWJhc2VSZXR1cm4pO1xuICAgIHRoaXMuJGVsLmh0bWwoc2F2ZWRJdGVtc0h0bWwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pOyIsInZhciB0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL3RlbXBsYXRlcy9zZWNvbmRRdWVzdGlvbi5oYnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG5cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7fSxcblxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgI2luZ3JlZGllbnQnIDogJ2dldEluZ3JlZGllbnQnXG4gIH0sXG5cbiAgc2V0VGFnOiBmdW5jdGlvbih0YWcpIHtcbiAgICB0aGlzLnRhZyA9IHRhZztcbiAgfSxcblxuICBnZXRJbmdyZWRpZW50OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGluZ3JlZGllbnQgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignY2xhc3MnKTtcbiAgICB0aGlzLiRlbC5kZXRhY2goKTtcbiAgICBCYWNrYm9uZS5oaXN0b3J5Lm5hdmlnYXRlKCAncmVzdWx0cy8nKyB0aGlzLnRhZyArJy8nKyBpbmdyZWRpZW50LCB7dHJpZ2dlcjp0cnVlfSApO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluZGV4ID0gdGVtcGxhdGUodGhpcy5tb2RlbC50b0pTT04oKSk7XG4gICAgdGhpcy4kZWwuaHRtbChpbmRleCk7XG4gICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn0pO1xuIiwidmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi4vLi4vLi4vdGVtcGxhdGVzL3NpZ251cC5oYnMnKTtcbnZhciBTaWduVXAgPSByZXF1aXJlKCcuLi9tb2RlbHMvU2lnblVwLmpzJyk7XG52YXIgZm9ybVZhbGlkYXRpb24gPSByZXF1aXJlKCcuLi8uLi9VdGlsL2Zvcm1WYWxpZGF0aW9uLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9LFxuXG4gIGV2ZW50czoge1xuICAgICdjbGljayAjc2lnbnVwJyA6ICdzaWdudXAnLFxuICAgICdjbGljayAjQ2FuY2VsJyA6ICdjYW5jZWwnXG4gIH0sXG5cbiAgY2FuY2VsOiBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgQmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZSgnLycsIHt0cmlnZ2VyOnRydWV9KTtcbiAgfSxcblxuICBzaWdudXA6IGZ1bmN0aW9uKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIHRoaXogPSB0aGlzO1xuICAgIHZhciBuYW1lID0gJCh0aGlzLmVsKS5maW5kKCcjbmFtZScpLnZhbCgpO1xuICAgIHZhciBlbWFpbCA9ICAkKHRoaXMuZWwpLmZpbmQoJyNlbWFpbElucHV0JykudmFsKCk7XG4gICAgdmFyIHBhc3N3b3JkID0gICQodGhpcy5lbCkuZmluZCgnI3Bhc3N3b3JkSW5wdXQnKS52YWwoKTtcbiAgICB2YXIgdmVyaWZ5UGFzc3dvcmQgPSAgJCh0aGlzLmVsKS5maW5kKCcjdmVyaWZ5UGFzc3dvcmQnKS52YWwoKTtcblxuICAgIGlmIChmb3JtVmFsaWRhdGlvbihuYW1lLGVtYWlsLHBhc3N3b3JkLHZlcmlmeVBhc3N3b3JkKT09PWZhbHNlKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgc2lnblVwID0gbmV3IFNpZ25VcCh7XG4gICAgICBuYW1lOm5hbWUsXG4gICAgICBsb2NhbEVtYWlsOmVtYWlsLFxuICAgICAgbG9jYWxQYXNzd29yZDpwYXNzd29yZFxuICAgIH0pO1xuXG4gICAgc2lnblVwLnNhdmUoW10se1xuICAgICAgZGF0YVR5cGU6ICd0ZXh0JyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG1vZGVsLCByZXNwb25zZSl7XG4gICAgICAgIGlmKHJlc3BvbnNlID09PSAnVGhpcyB1c2VyIGFscmVhZHkgZXhpc3RzJyl7XG4gICAgICAgICAgdGhpei4kKCcjc2lnbnVwJykuaHRtbCgnVXNlciBhbHJlYWR5IGV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgdGhpei5tb2RlbC5zZXQoe2xvY2FsRW1haWw6ZW1haWx9KTtcblxuICAgICAgICAgICQoJyNsb2dnZWRJbk5hbWUnKS5odG1sKHRoaXoubW9kZWwuZ2V0KCdsb2NhbEVtYWlsJykpO1xuICAgICAgICAgIEJhY2tib25lLmhpc3RvcnkubmF2aWdhdGUoJy8nLCB7dHJpZ2dlcjp0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICB9LFxuXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2lnbnVwSHRtbCA9IHRlbXBsYXRlKFwiXCIpO1xuICAgIHRoaXMuJGVsLmh0bWwoc2lnbnVwSHRtbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuPGRpdiBjbGFzcz1cXFwibGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMCBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1ucyB0ZXh0LWNlbnRlclxcXCI+XFxuICAgIDxidXR0b24gaWQ9XFxcInRhZ1xcXCIgY2xhc3M9XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnRhZykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC50YWcpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5sYWJlbCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5sYWJlbCk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2J1dHRvbj5cXG48L2Rpdj5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIGJ1ZmZlciArPSBcIjxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInF1ZXN0aW9uIGZ1bGwgbGFyZ2UtOCBtZWRpdW0tOCBzbWFsbC0xMCBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1ucyB0ZXh0LWNlbnRlclxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnF1ZXN0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnF1ZXN0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvZGl2PlxcbjwvZGl2PlxcblxcblwiO1xuICBzdGFjazEgPSBoZWxwZXJzLmVhY2guY2FsbChkZXB0aDAsIChkZXB0aDAgJiYgZGVwdGgwLmNob2ljZXMpLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oMSwgcHJvZ3JhbTEsIGRhdGEpLGRhdGE6ZGF0YX0pO1xuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuXFxuXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIFxuXG5cbiAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwib2ZmLWNhbnZhcy13cmFwXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcImlubmVyLXdyYXBcXFwiPlxcbiAgICA8bmF2IGNsYXNzPVxcXCJ0YWItYmFyXFxcIj5cXG4gICAgICA8c2VjdGlvbiBjbGFzcz1cXFwibGVmdC1zbWFsbFxcXCI+XFxuICAgICAgICA8YSBjbGFzcz1cXFwibGVmdC1vZmYtY2FudmFzLXRvZ2dsZSBtZW51LWljb25cXFwiPlxcbiAgICAgICAgICA8c3Bhbj48L3NwYW4+XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9zZWN0aW9uPlxcbiAgICAgIDxzZWN0aW9uIGNsYXNzPVxcXCJtaWRkbGUgdGFiLWJhci1zZWN0aW9uXFxcIj5cXG4gICAgICAgIDxhIGhyZWY9XFxcIi9cXFwiPjxpbWcgaWQ9XFxcImxvZ29cXFwiIHNyYz1cXFwiLi4vYXNzZXRzL2ltYWdlcy90b2FzdGllLnBuZ1xcXCIvPjwvYT5cXG4gICAgICA8L3NlY3Rpb24+XFxuICAgICAgICA8c2VjdGlvbiBjbGFzcz1cXFwicmlnaHRcXFwiPlxcbiAgICAgICAgICAgIDxoMiBpZD1cXFwibG9nZ2VkSW5OYW1lXFxcIj48L2gyPlxcbiAgICAgICAgPC9zZWN0aW9uPlxcbiAgICA8L25hdj5cXG4gICAgPGFzaWRlIGNsYXNzPVxcXCJsZWZ0LW9mZi1jYW52YXMtbWVudVxcXCI+XFxuICAgICAgPHVsIGNsYXNzPVxcXCJvZmYtY2FudmFzLWxpc3RcXFwiPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNsb2dpblxcXCI+TG9nIGluPC9hPjwvbGk+XFxuICAgICAgICA8bGk+PGEgaHJlZj1cXFwiL2xvZ291dFxcXCI+TG9nIG91dDwvYT48L2xpPlxcbiAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNteUFjY291bnRcXFwiPk15IEFjY291bnQ8L2E+PC9saT5cXG4gICAgICAgIDxsaT48YSBocmVmPVxcXCIjc2F2ZWRJdGVtc1xcXCI+U2F2ZWQgSXRlbXM8L2E+PC9saT5cXG4gICAgICA8L3VsPlxcbiAgICA8L2FzaWRlPlxcbiAgICA8aSBjbGFzcz1cXFwiZmEtbWVudVxcXCI+PC9pPlxcblxcbiAgICA8YSBjbGFzcz1cXFwiZXhpdC1vZmYtY2FudmFzXFxcIj48L2E+XFxuXFxuICA8ZGl2IGNsYXNzPVF1ZXN0aW9uPjwvZGl2PlxcbiAgPGRpdiBjbGFzcz1SZXN1bHQ+PC9kaXY+XFxuXFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJsb2dpbkZvcm0gc21hbGwtMTIgbWVkaXVtLTggbGFyZ2UtOCBzbWFsbC1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgbGFyZ2UtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgIDxmb3JtIGNsYXNzPVxcXCJsb2dpbkZvcm1cXFwiIGFjdGlvbj1cXFwiL2xvZ2luXFxcIiBtZXRob2Q9XFxcInBvc3RcXFwiPlxcbiAgICAgICAgPGlucHV0IGlkPVxcXCJlbWFpbElucHV0XFxcIiBuYW1lPVxcXCJlbWFpbFxcXCIgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcImVtYWlsXFxcIj5cXG4gICAgICAgIDxpbnB1dCBpZD1cXFwicGFzc3dvcmRJbnB1dFxcXCIgbmFtZT1cXFwicGFzc3dvcmRcXFwiIHR5cGU9XFxcInBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwicGFzc3dvcmRzXFxcIj5cXG4gICAgICAgIDxhIGNsYXNzPVxcXCJzdWItbGluZVxcXCIgaHJlZj1cXFwiXFxcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+XFxuICAgICAgICA8YnV0dG9uIGlkPVxcXCJsb2dpblxcXCIgdHlwZT1cXFwic3VibWl0XFxcIj5TaWduLWluPC9idXR0b24+XFxuXFxuICAgICAgICBcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkaXZpZGVyV29yZCBzbWFsbC0xIGxhcmdlLTEgbWVkaXVtLTEgc21hbGwtY2VudGVyZWQgbGFyZ2UtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIGNvbHVtbnNcXFwiPm9yPC9kaXY+XFxuICAgICAgICAgICBcXG4gICAgICAgXFxuXFxuICAgIDwvZm9ybT5cXG4gICAgPGRpdiBpZD1cXFwiY3JlYXRlQWNjb3VudFxcXCIgY2xhc3M9XFxcInNtYWxsLTEyIG1lZGl1bS04IGxhcmdlLTggc21hbGwtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIGxhcmdlLWNlbnRlcmVkIGNvbHVtbnNcXFwiPlxcbiAgICAgICAgPGEgaHJlZj1cXFwiI3NpZ251cFxcXCI+Q3JlYXRlIGFuIEFjY291bnQ8L2E+XFxuICAgIDwvZGl2PlxcbiAgICA8aDEgaWQ9XFxcImJhZENyZWRlbnRpYWxzXFxcIj48L2gxPlxcbjwvZGl2PlxcblwiO1xuICB9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImxvZ2luRm9ybSBzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgPGgxPlxcbiAgICAgIEVkaXQgQWNjb3VudCBJbmZvXFxuICAgIDwvaDE+XFxuICAgIDxoMiBpZD1cXFwidXNlck5hbWVcXFwiPjwvaDI+XFxuICAgIDxmb3JtICBtZXRob2Q9XFxcInBvc3RcXFwiPlxcbiAgICAgICAgPGgyPlZlcmlmeSBJbmZvcm1hdGlvbjwvaDI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcInZlcmlmeUVtYWlsXFxcIiBuYW1lPVxcXCJlbWFpbFxcXCIgcGxhY2Vob2xkZXI9XFxcImVtYWlsXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcInZlcmlmeVBhc3N3b3JkXFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcInBhc3N3b3JkXFxcIj5cXG5cXG4gICAgICAgIDxoMj5OZXcgZGV0YWlsczwvaDI+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcIm5ld05hbWVcXFwiIG5hbWU9XFxcIm5hbWVcXFwiIHBsYWNlaG9sZGVyPVxcXCJOYW1lXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBpZD1cXFwibmV3RW1haWxcXFwiIG5hbWU9XFxcImVtYWlsXFxcIiBwbGFjZWhvbGRlcj1cXFwiZW1haWxcXFwiPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInBhc3N3b3JkXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBpZD1cXFwibmV3UGFzc3dvcmRcXFwiIG5hbWU9XFxcInBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwicGFzc3dvcmRcXFwiPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInBhc3N3b3JkXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBpZD1cXFwibmV3UGFzc3dvcmRWZXJpZnlcXFwiIG5hbWU9XFxcInBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwidmVyaWZ5IHBhc3N3b3JkXFxcIj5cXG4gICAgICAgIDxidXR0b24gaWQ9XFxcImVkaXRJbmZvXFxcIj5FZGl0PC9idXR0b24+XFxuICAgIDwvZm9ybT5cXG4gICAgPGgxIGlkPVxcXCJlcnJvcnNcXFwiPjwvaDE+XFxuPC9kaXY+XCI7XG4gIH0pO1xuIiwiLy8gaGJzZnkgY29tcGlsZWQgSGFuZGxlYmFycyB0ZW1wbGF0ZVxudmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYnNmeS9ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlciwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cblxuICBidWZmZXIgKz0gXCIgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvY2t0YWlsUmVjaXBlSXRlbSBsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEyIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDxkaXYgaWQ9XFxcImZiLXJvb3RcXFwiPjwvZGl2PlxcbiAgICA8c2NyaXB0PlxcbiAgICAgICAgd2luZG93LmZiQXN5bmNJbml0ID0gZnVuY3Rpb24oKSB7XFxuICAgICAgICAgICAgRkIuaW5pdCh7XFxuICAgICAgICAgICAgICAgIGFwcElkICAgICAgOiAne3lvdXItYXBwLWlkfScsXFxuICAgICAgICAgICAgICAgIHN0YXR1cyAgICAgOiB0cnVlLFxcbiAgICAgICAgICAgICAgICB4ZmJtbCAgICAgIDogdHJ1ZVxcbiAgICAgICAgICAgIH0pO1xcbiAgICAgICAgfTtcXG5cXG4gICAgICAgIChmdW5jdGlvbihkLCBzLCBpZCl7XFxuICAgICAgICAgICAgdmFyIGpzLCBmanMgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xcbiAgICAgICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSkge3JldHVybjt9XFxuICAgICAgICAgICAganMgPSBkLmNyZWF0ZUVsZW1lbnQocyk7IGpzLmlkID0gaWQ7XFxuICAgICAgICAgICAganMuc3JjID0gXFxcIi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvYWxsLmpzXFxcIjtcXG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XFxuICAgICAgICB9KGRvY3VtZW50LCAnc2NyaXB0JywgJ2ZhY2Vib29rLWpzc2RrJykpO1xcbiAgICA8L3NjcmlwdD5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbEltYWdlXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuaW1nKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmltZyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcblxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbFRpdGxlXFxcIiBwcm9wZXJ0eT1cXFwib2c6dGl0bGVcXFwiIGNvbnRlbnQ9XFxcIlxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLm5hbWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAubmFtZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8ZGl2IGNsYXNzPVxcXCJmYi1zaGFyZS1idXR0b25cXFwiIGRhdGEtaHJlZj1cXFwiaHR0cDovL2lhbmpvaG5zb24uY29cXFwiIGRhdGEtdHlwZT1cXFwiYnV0dG9uXFxcIj48L2Rpdj5cXG48L2xpPlxcblxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbERlc2NyaXB0aW9uXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuZGVzY3JpcHRpb24pIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuZGVzY3JpcHRpb24pOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxTZXJ2aW5nXFxcIj5tYWtlcyBcIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuc2VydmluZ3MpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuc2VydmluZ3MpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiIHNlcnZpbmdzPC9saT5cXG4gICAgICAgIDxsaT5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwidGl0bGVSZWNpcGVcXFwiPkluZ3JlZGllbnRzOiA8L3NwYW4+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluZ3JlZGllbnRzKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmluZ3JlZGllbnRzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGk+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInRpdGxlUmVjaXBlXFxcIj5SZWNpcGU6IDwvc3Bhbj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuZGlyZWN0aW9ucykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5kaXJlY3Rpb25zKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgIDwvdWw+XFxuICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTQgbWVkaXVtLTQgc21hbGwtNiBsYXJnZS1jZW50ZXJlZCBtZWRpdW0tY2VudGVyZWQgc21hbGwtY2VudGVyZWQgY29sdW1uc1xcXCI+XFxuICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJyZWNpcGVCdXR0b25cXFwiPlNhdmUgSXRlbTwvYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgaGVscGVyLCBmdW5jdGlvblR5cGU9XCJmdW5jdGlvblwiLCBlc2NhcGVFeHByZXNzaW9uPXRoaXMuZXNjYXBlRXhwcmVzc2lvbjtcblxuXG4gIGJ1ZmZlciArPSBcIjxkaXYgY2xhc3M9XFxcImNvY2t0YWlsUmVjaXBlSXRlbSBsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEyIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG5cXG4gICAgPGRpdiBpZD1cXFwiZmItcm9vdFxcXCI+PC9kaXY+XFxuICAgIDxzY3JpcHQ+XFxuICAgICAgICB3aW5kb3cuZmJBc3luY0luaXQgPSBmdW5jdGlvbigpIHtcXG4gICAgICAgICAgICBGQi5pbml0KHtcXG4gICAgICAgICAgICAgICAgYXBwSWQgICAgICA6ICd7eW91ci1hcHAtaWR9JyxcXG4gICAgICAgICAgICAgICAgc3RhdHVzICAgICA6IHRydWUsXFxuICAgICAgICAgICAgICAgIHhmYm1sICAgICAgOiB0cnVlXFxuICAgICAgICAgICAgfSk7XFxuICAgICAgICB9O1xcblxcbiAgICAgICAgKGZ1bmN0aW9uKGQsIHMsIGlkKXtcXG4gICAgICAgICAgICB2YXIganMsIGZqcyA9IGQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocylbMF07XFxuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7cmV0dXJuO31cXG4gICAgICAgICAgICBqcyA9IGQuY3JlYXRlRWxlbWVudChzKTsganMuaWQgPSBpZDtcXG4gICAgICAgICAgICBqcy5zcmMgPSBcXFwiLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9hbGwuanNcXFwiO1xcbiAgICAgICAgICAgIGZqcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShqcywgZmpzKTtcXG4gICAgICAgIH0oZG9jdW1lbnQsICdzY3JpcHQnLCAnZmFjZWJvb2stanNzZGsnKSk7XFxuICAgIDwvc2NyaXB0PlxcblxcbiAgICA8dWw+XFxuICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsSW1hZ2VcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5pbWcpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuaW1nKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsVGl0bGVcXFwiIHByb3BlcnR5PVxcXCJvZzp0aXRsZVxcXCIgY29udGVudD1cXFwiXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMubmFtZSkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5uYW1lKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjxkaXYgY2xhc3M9XFxcImZiLXNoYXJlLWJ1dHRvblxcXCIgZGF0YS1ocmVmPVxcXCJodHRwOi8vaWFuam9obnNvbi5jb1xcXCIgZGF0YS10eXBlPVxcXCJidXR0b25cXFwiPjwvZGl2PlxcbiAgICAgICAgPC9saT5cXG4gICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxEZXNjcmlwdGlvblxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmRlc2NyaXB0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICA8bGkgY2xhc3M9XFxcImNvY2t0YWlsU2VydmluZ1xcXCI+bWFrZXMgXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLnNlcnZpbmdzKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLnNlcnZpbmdzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIiBzZXJ2aW5nczwvbGk+XFxuICAgICAgICA8bGk+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInRpdGxlUmVjaXBlXFxcIj5JbmdyZWRpZW50czogPC9zcGFuPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5pbmdyZWRpZW50cykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbmdyZWRpZW50cyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgPGxpPlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJ0aXRsZVJlY2lwZVxcXCI+UmVjaXBlOiA8L3NwYW4+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRpcmVjdGlvbnMpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuZGlyZWN0aW9ucyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICA8L3VsPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEwIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDxidXR0b24gY2xhc3M9XFxcInJlY2lwZUJ1dHRvblxcXCIgZGlzYWJsZWQ+QWxyZWFkeSBTYXZlZDwvYnV0dG9uPlxcbiAgICA8L2Rpdj5cXG5cIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfSk7XG4iLCIvLyBoYnNmeSBjb21waWxlZCBIYW5kbGViYXJzIHRlbXBsYXRlXG52YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hic2Z5L3J1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcztcblxuZnVuY3Rpb24gcHJvZ3JhbTEoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIGhlbHBlcjtcbiAgYnVmZmVyICs9IFwiXFxuICAgICAgICA8dWw+XFxuICAgICAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbEltYWdlXFxcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuaW1nKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmltZyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxUaXRsZVxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLm5hbWUpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAubmFtZSk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cXFwiY29ja3RhaWxEZXNjcmlwdGlvblxcXCI+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRlc2NyaXB0aW9uKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmRlc2NyaXB0aW9uKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICAgICAgPGxpIGNsYXNzPVxcXCJjb2NrdGFpbFNlcnZpbmdcXFwiPm1ha2VzIFwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5zZXJ2aW5ncykgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5zZXJ2aW5ncyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCIgc2VydmluZ3M8L2xpPlxcbiAgICAgICAgICAgIDxsaT48c3BhbiBjbGFzcz1cXFwidGl0bGVSZWNpcGVcXFwiPkluZ3JlZGllbnRzOiA8L3NwYW4+XCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmluZ3JlZGllbnRzKSB7IHN0YWNrMSA9IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSk7IH1cbiAgZWxzZSB7IGhlbHBlciA9IChkZXB0aDAgJiYgZGVwdGgwLmluZ3JlZGllbnRzKTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIjwvbGk+XFxuICAgICAgICAgICAgPGxpPjxzcGFuIGNsYXNzPVxcXCJ0aXRsZVJlY2lwZVxcXCI+UmVjaXBlOjwvc3Bhbj4gXCI7XG4gIGlmIChoZWxwZXIgPSBoZWxwZXJzLmRpcmVjdGlvbnMpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAuZGlyZWN0aW9ucyk7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2xpPlxcbiAgICAgICAgPC91bD5cXG4gICAgXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuZnVuY3Rpb24gcHJvZ3JhbTMoZGVwdGgwLGRhdGEpIHtcbiAgXG4gIFxuICByZXR1cm4gXCJcXG4gICAgICAgIDxoMT5Ob3RoaW5nIHRvIGRpc3BsYXkgLSBhZGQgaXRlbXM8L2gxPlxcbiAgICBcIjtcbiAgfVxuXG4gIGJ1ZmZlciArPSBcIjxkaXYgY2xhc3M9XFxcImNvY2t0YWlsUmVjaXBlSXRlbSBsYXJnZS04IG1lZGl1bS04IHNtYWxsLTEyIGxhcmdlLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBzbWFsbC1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG5cXG4gICAgXCI7XG4gIHN0YWNrMSA9IGhlbHBlcnMuZWFjaC5jYWxsKGRlcHRoMCwgZGVwdGgwLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYucHJvZ3JhbSgzLCBwcm9ncmFtMywgZGF0YSksZm46c2VsZi5wcm9ncmFtKDEsIHByb2dyYW0xLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcbjwvZGl2PlxcblxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXIsIGZ1bmN0aW9uVHlwZT1cImZ1bmN0aW9uXCIsIGVzY2FwZUV4cHJlc3Npb249dGhpcy5lc2NhcGVFeHByZXNzaW9uLCBzZWxmPXRoaXM7XG5cbmZ1bmN0aW9uIHByb2dyYW0xKGRlcHRoMCxkYXRhKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxLCBoZWxwZXI7XG4gIGJ1ZmZlciArPSBcIlxcbjxkaXYgY2xhc3M9XFxcImxhcmdlLTggbWVkaXVtLTggc21hbGwtMTAgbGFyZ2UtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIHNtYWxsLWNlbnRlcmVkIGNvbHVtbnMgdGV4dC1jZW50ZXJcXFwiPlxcbiAgICA8YnV0dG9uIGlkPVxcXCJpbmdyZWRpZW50XFxcIiBjbGFzcz1cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMuaW5ncmVkaWVudCkgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5pbmdyZWRpZW50KTsgc3RhY2sxID0gdHlwZW9mIGhlbHBlciA9PT0gZnVuY3Rpb25UeXBlID8gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KSA6IGhlbHBlcjsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIj5cIjtcbiAgaWYgKGhlbHBlciA9IGhlbHBlcnMubGFiZWwpIHsgc3RhY2sxID0gaGVscGVyLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgaGVscGVyID0gKGRlcHRoMCAmJiBkZXB0aDAubGFiZWwpOyBzdGFjazEgPSB0eXBlb2YgaGVscGVyID09PSBmdW5jdGlvblR5cGUgPyBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pIDogaGVscGVyOyB9XG4gIGJ1ZmZlciArPSBlc2NhcGVFeHByZXNzaW9uKHN0YWNrMSlcbiAgICArIFwiPC9idXR0b24+XFxuPC9kaXY+XFxuXCI7XG4gIHJldHVybiBidWZmZXI7XG4gIH1cblxuICBidWZmZXIgKz0gXCI8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJxdWVzdGlvbiBmdWxsIGxhcmdlLTggbWVkaXVtLTggc21hbGwtMTAgbGFyZ2UtY2VudGVyZWQgbWVkaXVtLWNlbnRlcmVkIHNtYWxsLWNlbnRlcmVkIGNvbHVtbnMgdGV4dC1jZW50ZXJcXFwiPlwiO1xuICBpZiAoaGVscGVyID0gaGVscGVycy5xdWVzdGlvbikgeyBzdGFjazEgPSBoZWxwZXIuY2FsbChkZXB0aDAsIHtoYXNoOnt9LGRhdGE6ZGF0YX0pOyB9XG4gIGVsc2UgeyBoZWxwZXIgPSAoZGVwdGgwICYmIGRlcHRoMC5xdWVzdGlvbik7IHN0YWNrMSA9IHR5cGVvZiBoZWxwZXIgPT09IGZ1bmN0aW9uVHlwZSA/IGhlbHBlci5jYWxsKGRlcHRoMCwge2hhc2g6e30sZGF0YTpkYXRhfSkgOiBoZWxwZXI7IH1cbiAgYnVmZmVyICs9IGVzY2FwZUV4cHJlc3Npb24oc3RhY2sxKVxuICAgICsgXCI8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiAgc3RhY2sxID0gaGVscGVycy5lYWNoLmNhbGwoZGVwdGgwLCAoZGVwdGgwICYmIGRlcHRoMC5jaG9pY2VzKSwge2hhc2g6e30saW52ZXJzZTpzZWxmLm5vb3AsZm46c2VsZi5wcm9ncmFtKDEsIHByb2dyYW0xLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcblxcblxcblxcblxcblxcblxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsIi8vIGhic2Z5IGNvbXBpbGVkIEhhbmRsZWJhcnMgdGVtcGxhdGVcbnZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGJzZnkvcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImxvZ2luRm9ybSBzbWFsbC0xMiBtZWRpdW0tOCBsYXJnZS04IHNtYWxsLWNlbnRlcmVkIG1lZGl1bS1jZW50ZXJlZCBsYXJnZS1jZW50ZXJlZCBjb2x1bW5zXFxcIj5cXG4gICAgPGgxPlxcbiAgICAgICAgQ3JlYXRlIEFjY291bnRcXG4gICAgPC9oMT5cXG4gICAgPGZvcm0gYWN0aW9uPVxcXCIjc2lnbnVwXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBpZD1cXFwibmFtZVxcXCIgbmFtZT1cXFwibmFtZVxcXCIgcGxhY2Vob2xkZXI9XFxcIk5hbWVcXFwiPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGlkPVxcXCJlbWFpbElucHV0XFxcIiBuYW1lPVxcXCJlbWFpbFxcXCIgcGxhY2Vob2xkZXI9XFxcImVtYWlsXFxcIj5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgaWQ9XFxcInBhc3N3b3JkSW5wdXRcXFwiIG5hbWU9XFxcInBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwicGFzc3dvcmRcXFwiPlxcblxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInBhc3N3b3JkXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBpZD1cXFwidmVyaWZ5UGFzc3dvcmRcXFwiIG5hbWU9XFxcInBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwiY29uZmlybSBwYXN3b3JkXFxcIj4gICAgXFxuICAgIDwvZm9ybT5cXG4gICAgPGJ1dHRvbiBpZD1cXFwic2lnbnVwXFxcIj5DcmVhdGUgQWNjb3VudDwvYnV0dG9uPlxcblxcblxcbiAgICA8YnV0dG9uIGlkPVxcXCJDYW5jZWxcXFwiPkNhbmNlbDwvYnV0dG9uPlxcbiAgICA8aDEgaWQ9XFxcImVycm9yc1xcXCI+PC9oMT5cXG48L2Rpdj5cXG5cXG5cIjtcbiAgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qZ2xvYmFscyBIYW5kbGViYXJzOiB0cnVlICovXG52YXIgYmFzZSA9IHJlcXVpcmUoXCIuL2hhbmRsZWJhcnMvYmFzZVwiKTtcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9zYWZlLXN0cmluZ1wiKVtcImRlZmF1bHRcIl07XG52YXIgRXhjZXB0aW9uID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy91dGlsc1wiKTtcbnZhciBydW50aW1lID0gcmVxdWlyZShcIi4vaGFuZGxlYmFycy9ydW50aW1lXCIpO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbnZhciBjcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcblxuICBoYi5WTSA9IHJ1bnRpbWU7XG4gIGhiLnRlbXBsYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiBydW50aW1lLnRlbXBsYXRlKHNwZWMsIGhiKTtcbiAgfTtcblxuICByZXR1cm4gaGI7XG59O1xuXG52YXIgSGFuZGxlYmFycyA9IGNyZWF0ZSgpO1xuSGFuZGxlYmFycy5jcmVhdGUgPSBjcmVhdGU7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gSGFuZGxlYmFyczsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIEV4Y2VwdGlvbiA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvblwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBWRVJTSU9OID0gXCIxLjMuMFwiO1xuZXhwb3J0cy5WRVJTSU9OID0gVkVSU0lPTjt2YXIgQ09NUElMRVJfUkVWSVNJT04gPSA0O1xuZXhwb3J0cy5DT01QSUxFUl9SRVZJU0lPTiA9IENPTVBJTEVSX1JFVklTSU9OO1xudmFyIFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPj0gMS4wLjAnXG59O1xuZXhwb3J0cy5SRVZJU0lPTl9DSEFOR0VTID0gUkVWSVNJT05fQ0hBTkdFUztcbnZhciBpc0FycmF5ID0gVXRpbHMuaXNBcnJheSxcbiAgICBpc0Z1bmN0aW9uID0gVXRpbHMuaXNGdW5jdGlvbixcbiAgICB0b1N0cmluZyA9IFV0aWxzLnRvU3RyaW5nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuZnVuY3Rpb24gSGFuZGxlYmFyc0Vudmlyb25tZW50KGhlbHBlcnMsIHBhcnRpYWxzKSB7XG4gIHRoaXMuaGVscGVycyA9IGhlbHBlcnMgfHwge307XG4gIHRoaXMucGFydGlhbHMgPSBwYXJ0aWFscyB8fCB7fTtcblxuICByZWdpc3RlckRlZmF1bHRIZWxwZXJzKHRoaXMpO1xufVxuXG5leHBvcnRzLkhhbmRsZWJhcnNFbnZpcm9ubWVudCA9IEhhbmRsZWJhcnNFbnZpcm9ubWVudDtIYW5kbGViYXJzRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogSGFuZGxlYmFyc0Vudmlyb25tZW50LFxuXG4gIGxvZ2dlcjogbG9nZ2VyLFxuICBsb2c6IGxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4sIGludmVyc2UpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEV4Y2VwdGlvbignQXJnIG5vdCBzdXBwb3J0ZWQgd2l0aCBtdWx0aXBsZSBoZWxwZXJzJyk7IH1cbiAgICAgIFV0aWxzLmV4dGVuZCh0aGlzLmhlbHBlcnMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW52ZXJzZSkgeyBmbi5ub3QgPSBpbnZlcnNlOyB9XG4gICAgICB0aGlzLmhlbHBlcnNbbmFtZV0gPSBmbjtcbiAgICB9XG4gIH0sXG5cbiAgcmVnaXN0ZXJQYXJ0aWFsOiBmdW5jdGlvbihuYW1lLCBzdHIpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJ0aWFsc1tuYW1lXSA9IHN0cjtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnMoaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihhcmcpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiTWlzc2luZyBoZWxwZXI6ICdcIiArIGFyZyArIFwiJ1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UgfHwgZnVuY3Rpb24oKSB7fSwgZm4gPSBvcHRpb25zLmZuO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgaWYoY29udGV4dCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZuKHRoaXMpO1xuICAgIH0gZWxzZSBpZihjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYoY29udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5oZWxwZXJzLmVhY2goY29udGV4dCwgb3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW52ZXJzZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuKGNvbnRleHQpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdmFyIGZuID0gb3B0aW9ucy5mbiwgaW52ZXJzZSA9IG9wdGlvbnMuaW52ZXJzZTtcbiAgICB2YXIgaSA9IDAsIHJldCA9IFwiXCIsIGRhdGE7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhKSB7XG4gICAgICBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKGlzQXJyYXkoY29udGV4dCkpIHtcbiAgICAgICAgZm9yKHZhciBqID0gY29udGV4dC5sZW5ndGg7IGk8ajsgaSsrKSB7XG4gICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgZGF0YS5maXJzdCA9IChpID09PSAwKTtcbiAgICAgICAgICAgIGRhdGEubGFzdCAgPSAoaSA9PT0gKGNvbnRleHQubGVuZ3RoLTEpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgaWYoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBpZihkYXRhKSB7IFxuICAgICAgICAgICAgICBkYXRhLmtleSA9IGtleTsgXG4gICAgICAgICAgICAgIGRhdGEuaW5kZXggPSBpO1xuICAgICAgICAgICAgICBkYXRhLmZpcnN0ID0gKGkgPT09IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtrZXldLCB7ZGF0YTogZGF0YX0pO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmKGkgPT09IDApe1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignd2l0aCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihjb250ZXh0KSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgICBpZiAoIVV0aWxzLmlzRW1wdHkoY29udGV4dCkpIHJldHVybiBvcHRpb25zLmZuKGNvbnRleHQpO1xuICB9KTtcblxuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgIHZhciBsZXZlbCA9IG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCA/IHBhcnNlSW50KG9wdGlvbnMuZGF0YS5sZXZlbCwgMTApIDogMTtcbiAgICBpbnN0YW5jZS5sb2cobGV2ZWwsIGNvbnRleHQpO1xuICB9KTtcbn1cblxudmFyIGxvZ2dlciA9IHtcbiAgbWV0aG9kTWFwOiB7IDA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InIH0sXG5cbiAgLy8gU3RhdGUgZW51bVxuICBERUJVRzogMCxcbiAgSU5GTzogMSxcbiAgV0FSTjogMixcbiAgRVJST1I6IDMsXG4gIGxldmVsOiAzLFxuXG4gIC8vIGNhbiBiZSBvdmVycmlkZGVuIGluIHRoZSBob3N0IGVudmlyb25tZW50XG4gIGxvZzogZnVuY3Rpb24obGV2ZWwsIG9iaikge1xuICAgIGlmIChsb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXS5jYWxsKGNvbnNvbGUsIG9iaik7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0cy5sb2dnZXIgPSBsb2dnZXI7XG5mdW5jdGlvbiBsb2cobGV2ZWwsIG9iaikgeyBsb2dnZXIubG9nKGxldmVsLCBvYmopOyB9XG5cbmV4cG9ydHMubG9nID0gbG9nO3ZhciBjcmVhdGVGcmFtZSA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgb2JqID0ge307XG4gIFV0aWxzLmV4dGVuZChvYmosIG9iamVjdCk7XG4gIHJldHVybiBvYmo7XG59O1xuZXhwb3J0cy5jcmVhdGVGcmFtZSA9IGNyZWF0ZUZyYW1lOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXJyb3JQcm9wcyA9IFsnZGVzY3JpcHRpb24nLCAnZmlsZU5hbWUnLCAnbGluZU51bWJlcicsICdtZXNzYWdlJywgJ25hbWUnLCAnbnVtYmVyJywgJ3N0YWNrJ107XG5cbmZ1bmN0aW9uIEV4Y2VwdGlvbihtZXNzYWdlLCBub2RlKSB7XG4gIHZhciBsaW5lO1xuICBpZiAobm9kZSAmJiBub2RlLmZpcnN0TGluZSkge1xuICAgIGxpbmUgPSBub2RlLmZpcnN0TGluZTtcblxuICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBsaW5lICsgJzonICsgbm9kZS5maXJzdENvbHVtbjtcbiAgfVxuXG4gIHZhciB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICBpZiAobGluZSkge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBub2RlLmZpcnN0Q29sdW1uO1xuICB9XG59XG5cbkV4Y2VwdGlvbi5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBFeGNlcHRpb247IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBFeGNlcHRpb24gPSByZXF1aXJlKFwiLi9leGNlcHRpb25cIilbXCJkZWZhdWx0XCJdO1xudmFyIENPTVBJTEVSX1JFVklTSU9OID0gcmVxdWlyZShcIi4vYmFzZVwiKS5DT01QSUxFUl9SRVZJU0lPTjtcbnZhciBSRVZJU0lPTl9DSEFOR0VTID0gcmVxdWlyZShcIi4vYmFzZVwiKS5SRVZJU0lPTl9DSEFOR0VTO1xuXG5mdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICB2YXIgY29tcGlsZXJSZXZpc2lvbiA9IGNvbXBpbGVySW5mbyAmJiBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgIGN1cnJlbnRSZXZpc2lvbiA9IENPTVBJTEVSX1JFVklTSU9OO1xuXG4gIGlmIChjb21waWxlclJldmlzaW9uICE9PSBjdXJyZW50UmV2aXNpb24pIHtcbiAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiA8IGN1cnJlbnRSZXZpc2lvbikge1xuICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gUkVWSVNJT05fQ0hBTkdFU1tjb21waWxlclJldmlzaW9uXTtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhbiBvbGRlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoXCIrcnVudGltZVZlcnNpb25zK1wiKSBvciBkb3duZ3JhZGUgeW91ciBydW50aW1lIHRvIGFuIG9sZGVyIHZlcnNpb24gKFwiK2NvbXBpbGVyVmVyc2lvbnMrXCIpLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYSBuZXdlciB2ZXJzaW9uIG9mIEhhbmRsZWJhcnMgdGhhbiB0aGUgY3VycmVudCBydW50aW1lLiBcIitcbiAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5jaGVja1JldmlzaW9uID0gY2hlY2tSZXZpc2lvbjsvLyBUT0RPOiBSZW1vdmUgdGhpcyBsaW5lIGFuZCBicmVhayB1cCBjb21waWxlUGFydGlhbFxuXG5mdW5jdGlvbiB0ZW1wbGF0ZSh0ZW1wbGF0ZVNwZWMsIGVudikge1xuICBpZiAoIWVudikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGVcIik7XG4gIH1cblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICB2YXIgaW52b2tlUGFydGlhbFdyYXBwZXIgPSBmdW5jdGlvbihwYXJ0aWFsLCBuYW1lLCBjb250ZXh0LCBoZWxwZXJzLCBwYXJ0aWFscywgZGF0YSkge1xuICAgIHZhciByZXN1bHQgPSBlbnYuVk0uaW52b2tlUGFydGlhbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBpZiAoZW52LmNvbXBpbGUpIHtcbiAgICAgIHZhciBvcHRpb25zID0geyBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcbiAgICAgIHBhcnRpYWxzW25hbWVdID0gZW52LmNvbXBpbGUocGFydGlhbCwgeyBkYXRhOiBkYXRhICE9PSB1bmRlZmluZWQgfSwgZW52KTtcbiAgICAgIHJldHVybiBwYXJ0aWFsc1tuYW1lXShjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZSBwYXJ0aWFsIFwiICsgbmFtZSArIFwiIGNvdWxkIG5vdCBiZSBjb21waWxlZCB3aGVuIHJ1bm5pbmcgaW4gcnVudGltZS1vbmx5IG1vZGVcIik7XG4gICAgfVxuICB9O1xuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIHZhciBjb250YWluZXIgPSB7XG4gICAgZXNjYXBlRXhwcmVzc2lvbjogVXRpbHMuZXNjYXBlRXhwcmVzc2lvbixcbiAgICBpbnZva2VQYXJ0aWFsOiBpbnZva2VQYXJ0aWFsV3JhcHBlcixcbiAgICBwcm9ncmFtczogW10sXG4gICAgcHJvZ3JhbTogZnVuY3Rpb24oaSwgZm4sIGRhdGEpIHtcbiAgICAgIHZhciBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV07XG4gICAgICBpZihkYXRhKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gcHJvZ3JhbShpLCBmbiwgZGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICBwcm9ncmFtV3JhcHBlciA9IHRoaXMucHJvZ3JhbXNbaV0gPSBwcm9ncmFtKGksIGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9ncmFtV3JhcHBlcjtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICB2YXIgcmV0ID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgVXRpbHMuZXh0ZW5kKHJldCwgcGFyYW0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIHByb2dyYW1XaXRoRGVwdGg6IGVudi5WTS5wcm9ncmFtV2l0aERlcHRoLFxuICAgIG5vb3A6IGVudi5WTS5ub29wLFxuICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIG5hbWVzcGFjZSA9IG9wdGlvbnMucGFydGlhbCA/IG9wdGlvbnMgOiBlbnYsXG4gICAgICAgIGhlbHBlcnMsXG4gICAgICAgIHBhcnRpYWxzO1xuXG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGhlbHBlcnMgPSBvcHRpb25zLmhlbHBlcnM7XG4gICAgICBwYXJ0aWFscyA9IG9wdGlvbnMucGFydGlhbHM7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSB0ZW1wbGF0ZVNwZWMuY2FsbChcbiAgICAgICAgICBjb250YWluZXIsXG4gICAgICAgICAgbmFtZXNwYWNlLCBjb250ZXh0LFxuICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgcGFydGlhbHMsXG4gICAgICAgICAgb3B0aW9ucy5kYXRhKTtcblxuICAgIGlmICghb3B0aW9ucy5wYXJ0aWFsKSB7XG4gICAgICBlbnYuVk0uY2hlY2tSZXZpc2lvbihjb250YWluZXIuY29tcGlsZXJJbmZvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5leHBvcnRzLnRlbXBsYXRlID0gdGVtcGxhdGU7ZnVuY3Rpb24gcHJvZ3JhbVdpdGhEZXB0aChpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKTtcblxuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBbY29udGV4dCwgb3B0aW9ucy5kYXRhIHx8IGRhdGFdLmNvbmNhdChhcmdzKSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBhcmdzLmxlbmd0aDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydHMucHJvZ3JhbVdpdGhEZXB0aCA9IHByb2dyYW1XaXRoRGVwdGg7ZnVuY3Rpb24gcHJvZ3JhbShpLCBmbiwgZGF0YSkge1xuICB2YXIgcHJvZyA9IGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gIH07XG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSAwO1xuICByZXR1cm4gcHJvZztcbn1cblxuZXhwb3J0cy5wcm9ncmFtID0gcHJvZ3JhbTtmdW5jdGlvbiBpbnZva2VQYXJ0aWFsKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gIHZhciBvcHRpb25zID0geyBwYXJ0aWFsOiB0cnVlLCBoZWxwZXJzOiBoZWxwZXJzLCBwYXJ0aWFsczogcGFydGlhbHMsIGRhdGE6IGRhdGEgfTtcblxuICBpZihwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwiVGhlIHBhcnRpYWwgXCIgKyBuYW1lICsgXCIgY291bGQgbm90IGJlIGZvdW5kXCIpO1xuICB9IGVsc2UgaWYocGFydGlhbCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0cy5pbnZva2VQYXJ0aWFsID0gaW52b2tlUGFydGlhbDtmdW5jdGlvbiBub29wKCkgeyByZXR1cm4gXCJcIjsgfVxuXG5leHBvcnRzLm5vb3AgPSBub29wOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQnVpbGQgb3V0IG91ciBiYXNpYyBTYWZlU3RyaW5nIHR5cGVcbmZ1bmN0aW9uIFNhZmVTdHJpbmcoc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufVxuXG5TYWZlU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gXCJcIiArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTYWZlU3RyaW5nOyIsIlwidXNlIHN0cmljdFwiO1xuLypqc2hpbnQgLVcwMDQgKi9cbnZhciBTYWZlU3RyaW5nID0gcmVxdWlyZShcIi4vc2FmZS1zdHJpbmdcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKG9iaiwgdmFsdWUpIHtcbiAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7dmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydHMudG9TdHJpbmcgPSB0b1N0cmluZztcbi8vIFNvdXJjZWQgZnJvbSBsb2Rhc2hcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHRcbnZhciBpc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn07XG4vLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbnZhciBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBlc2NhcGVFeHByZXNzaW9uKHN0cmluZykge1xuICAvLyBkb24ndCBlc2NhcGUgU2FmZVN0cmluZ3MsIHNpbmNlIHRoZXkncmUgYWxyZWFkeSBzYWZlXG4gIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBTYWZlU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy50b1N0cmluZygpO1xuICB9IGVsc2UgaWYgKCFzdHJpbmcgJiYgc3RyaW5nICE9PSAwKSB7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBGb3JjZSBhIHN0cmluZyBjb252ZXJzaW9uIGFzIHRoaXMgd2lsbCBiZSBkb25lIGJ5IHRoZSBhcHBlbmQgcmVnYXJkbGVzcyBhbmRcbiAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICBzdHJpbmcgPSBcIlwiICsgc3RyaW5nO1xuXG4gIGlmKCFwb3NzaWJsZS50ZXN0KHN0cmluZykpIHsgcmV0dXJuIHN0cmluZzsgfVxuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoYmFkQ2hhcnMsIGVzY2FwZUNoYXIpO1xufVxuXG5leHBvcnRzLmVzY2FwZUV4cHJlc3Npb24gPSBlc2NhcGVFeHByZXNzaW9uO2Z1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnRzLmlzRW1wdHkgPSBpc0VtcHR5OyIsIi8vIENyZWF0ZSBhIHNpbXBsZSBwYXRoIGFsaWFzIHRvIGFsbG93IGJyb3dzZXJpZnkgdG8gcmVzb2x2ZVxuLy8gdGhlIHJ1bnRpbWUgb24gYSBzdXBwb3J0ZWQgcGF0aC5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2Nqcy9oYW5kbGViYXJzLnJ1bnRpbWUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImhhbmRsZWJhcnMvcnVudGltZVwiKVtcImRlZmF1bHRcIl07XG4iXX0=
