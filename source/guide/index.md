title: Overview
type: guide
order: 1
---

Vue.js is a library that aims to simplify the development of interactive interfaces.

Technically, it provides the **[ViewModel](#ViewModel)** layer of the MVVM pattern, which connects the **[View](#View)** and the **[Model](#Model)** via two way **[Data Bindings](#Data_Binding)**.

Philosophically, the goal is to allow the developer to embrace an extremely minimal mental model when dealing with interfaces - there's only one type of object you need to worry about: the ViewModel. It is where all the view logic happens, and manipulating the ViewModel will automatically keep the View and the Model in sync. Actuall DOM manipulations and output formatting are abstracted away into **[Directives](#Directive)** and **[Filters](#Filter)**.

Vue.js shares a number of concepts with AngularJS, but is overall much simpler. If you have used Angular before, you will find vue.js very easy to pick up.

## View

The actual HTML that the user sees.

## Template

HTML with additional markup.

## Model

A slightly modified plain JavaScript object.

## ViewModel

An object that syncs the Model and the View. In vue.js, ViewModels are instantiated with the `Vue` constructor or its sub-classes. This is also the primary object that you will be interacting with as a developer when using vue.js.

## Data Binding

Establish a connection between the user interface and the actual data, so that when the state of one side changes, the other side changes accordingly. This saves the developer the trouble of manually keeping things in sync.

## Directive

A prefixed HTML attribute that tells VueJS to do something about an element.

## Filter

A function to process the value with before updating the View.

## Expression

Simple JavaScript expressions that can be used inside directives.

## Computed Property

A model property that gets auto-updated when its dependencies change.