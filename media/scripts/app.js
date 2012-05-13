(function() {
  App = Backbone.Model.extend({
    initialize: function(options) {
      this.slider = new Slider();
    }
  });
  
  AppView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.model.bind('change:person', this.personChange)
    },

    personChange: function(model, person) {
      var view = this;
      if (this.personView) {
        this.personView.remove(function() {
          view.insertPerson(person);
        });
      } else {
        view.insertPerson(person);
      }
    },

    insertPerson: function(person) {
      this.personView = new PersonDetailView({model: person});
      var $el = this.personView.render().$el;
      $el.css({'margin-left': $(window).width()});
      this.$details.append($el);
      $el.animate({'margin-left': 0});
    },
    
    template: _.template($('.app-template').html()),
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$details = this.$('.details');

      var sliderView = new SliderView({model: this.model.slider, el: this.$('.slider')});
      sliderView.render()
      
      return this;
    }
  });

  Person = Backbone.Model.extend({
    defaults: {
      'name': 'Josh Nielsen',
      'bio': 'Some bio here',
      'img': 'media/styles/images/josh.jpg',
      'skills': ['coding', 'architecture', 'UI'],
      'twitter': 'http://twitter.com/joshontheweb',
      'email': 'josh@joshontheweb.com'
    }
  });

  PersonView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
    },
    
    template: _.template($('.person-template').html()),
    className: 'person',

    events: {
      'click': 'selectPerson'
    },

    selectPerson: function(e) {
      e.preventDefault();
      window.app.set({'person': this.model});
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }     
  });

  People = Backbone.Collection.extend({
    model: Person
  });
  
  PersonDetailView = Backbone.View.extend({
    template: _.template($('.person-detail-template').html()),
    
    remove: function(callback) {
      var view = this;
      this.$el.animate({'margin-left': (-1 * $(window).width())}, function(){
        view.$el.remove();
        callback();
      });
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }     
  });

  Slider = Backbone.Model.extend({
    initialize: function(options) {
      this.people = new People(_.shuffle(people));
    }
  });
  
  SliderView = Backbone.View.extend({
    template: _.template($('.slider-template').html()),

    insertPerson: function(person) {
      var personView = new PersonView({model: person});
      var width = this.$inner.width();
      this.$inner.css('width', width + 380);
      this.$inner.append(personView.render().el);
    },
    
    render: function() {
      var view = this;
      this.$el.html(this.template(this.model.toJSON()));
      this.$inner = this.$('.slider-inner');
      
      this.model.people.each(function(person) {
        view.insertPerson(person);
      });
      
      return this;
    } 
  });

  window.app = new App();
  window.appView = new AppView({model: app, el: $('.container')});
  window.appView.render();
  window.app.set({'person': window.app.slider.people.at(0)});
})();
