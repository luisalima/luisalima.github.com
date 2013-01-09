---
layout: post
title: "How I test part IV -- testing controllers in rails"
date: 2013-01-09 11:21
comments: true
categories: testing rails controllers rspec factory_girl
---

First and foremost, I advise you to [read this post from Everyday Rails](http://everydayrails.com/2012/04/07/testing-series-rspec-controllers.html). It gives a very nice overview, by controller method, of what controller tests should look like. Like Aaron, I had read about testing and noone advises you to test controllers -- rather, they would say "test models and do integration testing, and controllers will be covered by those tests". But as you can see in ["Yes, you should write controller tests!"](http://solnic.eu/2012/02/02/yes-you-should-write-controller-tests.html), controllers should be tested. I'll post their reasons here and add a few reasons extra why to test controllers:

* Controllers are models, too;
* Controller specs can be written and ran more quickly than integration tests;
* (My own reason #1) It's very easy to write them using the basic scaffholding provided;
* (My own reason #2) If they are not easy to write, it's because you are doing some nasty complex not-that-CRUDdy stuff. Uh oh. Which is what was happening in my case.

But mainly, I don't see tests as testing instruments per se. I see tests as a way to reflect on your code, see how complex it is, and an opportunity for refactoring as well.

That being said... What I did was to pick up the scaffholding and adapt it as needed, and here is the trouble that I ran into when testing controllers.

First, run the scaffholding routing tests. Yeah, just go ahead and do it. And now correct them to account for all the nested resource paths that you have, as well as the paths that you don't want to allow. You are going to need it.

Now open your scaffholding controller tests. Each example refers to a single method of the controller, and you have tests for each action that the method must take. If you run them and they don't behave as expected, there can be several reasons, but from my (very limited experience), here are the most common:

1. you didn't set your valid_attributes properly -- including having nested attributes that are required and are not being set;
2. you are using authentication and need a current_user (modifying valid_session);
3. you have nested resources and so need to set the id(s) of the parent resource(s).

Let's go through each of these in order...

Attributes
----------

First and foremost, have you tested your factories in your models? Good.

What I usually do is to make use of the *FactoryGirl attributes_for* method and just stick it in valid_attributes:

<pre><code>def valid_attributes
  FactoryGirl.attributes_for(:my_model)
end
</code></pre>

However, this won't work when you have *validates_presence_of* for a has_one association. Say that my model has:

<pre><code>
	has_one :banana
	validates_presence_of :banana
	accepts_nested_attributes_for :banana
</code></pre>

Then, even if you have the association with the banana model in your "my_model" Factory, you'll get an error because attributes_for does not include associations and thus banana is not there. To fix that, we do:

<pre><code>def valid_attributes
	banana_attribs = FactoryGirl.attributes_for(:banana)
  FactoryGirl.attributes_for(:my_model).merge({:banana_attributes => banana_attribs})
end
</code></pre>

Finally... if your model belongs_to another model, let's say that it looks like this (can you tell I'm hungry?):

<pre><code>
	has_one :banana
	validates_presence_of :banana
	accepts_nested_attributes_for :banana
	belongs_to :strawberry
</code></pre>

Assuming that you set up this association correctly in FactoryGirl, you'll have a strawberry_id in your model's attributes. You have two options: either to set it up as an attr_accessible, or to get rid of it in the valid_attributes in order not to get a security error:

<pre><code>def valid_attributes
	banana_attribs = FactoryGirl.attributes_for(:banana)
  FactoryGirl.attributes_for(:my_model).except(:strawberry_id).merge({:banana_attributes => banana_attribs})
end
</code></pre>

Disclaimer: I was going to write a method go go through all the associations and do this automagically, but then I figured that it was kind of cheating because it is really valuable, like I said, to reflect on the way that you are writing your code. At least for me, it is.

Authentication and authorization -- you need valid session data and a current_user variable
-------------------------------------------------------------------------------------------

If you are using any kind of authentication, you need to set up a valid current user and a valid session. Here's [how to do it if you are using Devise](https://github.com/plataformatec/devise/wiki/How-To%3a-Controllers-and-Views-tests-with-Rails-3-%28and-rspec%29):

<pre><code>before(:each) do
  @request.env["devise.mapping"] = Devise.mappings[:user]
  user = FactoryGirl.create(:user)
  user.add_role(:master_of_all_fruits) # don't forget that if you are doing authorization, you need to set up the correct role as well
 	user.confirm! # or set a confirmed_at inside the factory. Only necessary if you are using the confirmable module
  sign_in user
end

it "should have a current_user" do
  subject.current_user.should_not be_nil
end
</code></pre>

Also, don't forget to set up the session:

<pre><code>def valid_session
  {"warden.user.user.key" => session["warden.user.user.key"]}
end
</code></pre>

The errors that are given are not clear at all in this case, so make sure to check that you didn't forget to set up the valid session and the current_user!

Nested resources
----------------

If my_model is a nested resource, you need to adapt your controller spec in order to account for that. Suppose that we have

<pre><code>resources :strawberries do
  resources :my_model do
</code></pre>

When you run the scaffholding for my_model controller tests, you'll get a "No route matches..." followed by a hash of my_model.

So what you have to do is to:
* add the strawberry_id to the actions that require a /strawberries/:strawberry_id/my_model route;
* add the @strawberry to the redirects that require the same type of routes.

What I do is to use a before(:each) that creates the required @strawberry:

<pre><code>before(:each) do
    @strawberry = FactoryGirl.create(:strawberry)
  end

it "redirects to the created my_model" do
post :create, {:strawberry_id => @strawberry.id, :my_model => valid_attributes}, valid_session
response.should redirect_to([@strawberry, MyModel.last])
end

it "redirects to the my_models list" do
  my_model = MyModel.create! valid_attributes
  delete :destroy, {:strawberry_id => @strawberry.id, :id => my_model.to_param}, valid_session
  response.should redirect_to(strawberry_my_models_url(@strawberry))
end

# Don't forget to create my_models for @strawberry in the nested route!
describe "GET index" do
  it "assigns all my_models as @my_models" do
    my_model = MyModel.create! valid_attributes
    @strawberry.my_models << my_model
    get :index, {:strawberry_id => @strawberry.id}, valid_session
    assigns(:my_models).should eq([my_model])
  end
end
</code></pre>

What if you also have a route like this:

<pre><code> resources :my_models, :only => [:index, :show]
</code></pre>

What I do is that I divide the tests into two contexts:

<pre><code> context "directly via /my_models" do
  #...
end

context "via /strawberries/:strawberry_id/my_models" do
  #...
end
</code></pre>

and place the "before(:each)" that creates @strawberry in the nested route context.

Conclusion
----------

I managed to detect many bugs in my controllers doing this (especially variables that I had assumed not to be nil and that were not set). Testing controllers is easy and fast, so I strongly advise you to test your controllers!

Eventually, I'll also do a post on integration testing with rspec, but for now, [here's another resource from Everyday Rails that covers the topic very nicely](http://everydayrails.com/2012/04/24/testing-series-rspec-requests.html). Enjoy!




