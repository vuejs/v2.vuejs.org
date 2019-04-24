---
title: Introduction
type: cookbook
order: 0
---

## The Cookbook vs the Guide

How is the cookbook different from the guide? Why is this necessary?

* **Greater Focus**: In the guide, we're essentially telling a story. Each section builds on and assumes knowledge from each previous section. In the cookbook, each recipe can and should stand on its own. This means recipes can focus on one specific aspect of Vue, rather than having to give a general overview.

* **Greater Depth**: To avoid making the guide too long, we try to include only the simplest possible examples to help you understand each feature. Then we move on. In the cookbook, we can include more complex examples, combining features in interesting ways. Each recipe can also be as long and detailed as it needs to be, in order to fully explore its niche.

* **Teaching JavaScript**: In the guide, we assume at least intermediate familiarity with ES5 JavaScript. For example, we won't explain how `Array.prototype.filter` works in a computed property that filters a list. In the cookbook however, essential JavaScript features (including ES6/2015+) can be explored and explained in the context of how they help us build better Vue applications.

* **Exploring the Ecosystem**: For advanced features, we assume some ecosystem knowledge. For example, if you want to use single-file components in Webpack, we don't explain how to configure the non-Vue parts of the Webpack config. In the cookbook, we have the space to explore these ecosystem libraries in more depth - at least to the extent that is universally useful for Vue developers.

<p class="tip">With all these differences, please note that the cookbook is still _not_ a step-by-step manual. For most of its content, you are expected to have a basic understanding of concepts like HTML, CSS, JavaScript, npm/yarn, etc.</p>

## Cookbook Contributions

### What we're looking for

The Cookbook gives developers examples to work off of that both cover common or interesting use cases, and also progressively explain more complex detail. Our goal is to move beyond a simple introductory example, and demonstrate concepts that are more widely applicable, as well as some caveats to the approach.

If you're interested in contributing, please initiate collaboration by filing an issue under the tag **cookbook idea** with your concept so that we can help guide you to a successful pull request. After your idea has been approved, please follow the template below as much as possible. Some sections are required, and some are optional. Following the numerical order is strongly suggested, but not required.

Recipes should generally:

> * Solve a specific, common problem
> * Start with the simplest possible example
> * Introduce complexities one at a time
> * Link to other docs, rather than re-explaining concepts
> * Describe the problem, rather than assuming familiarity
> * Explain the process, rather than just the end result
> * Explain the pros and cons of your strategy, including when it is and isn't appropriate
> * Mention alternative solutions, if relevant, but leave in-depth explorations to a separate recipe

We request that you follow the template below. We understand, however, that there are times when you may necessarily need to deviate for clarity or flow. Either way, all recipes should at some point discuss the nuance of the choice made using this pattern, preferably in the form of the alternative patterns section.

### Base Example

_required_

1.  Articulate the problem in a sentence or two.
2.  Explain the simplest possible solution in a sentence or two.
3.  Show a small code sample.
4.  Explain what this accomplishes in a sentence.

### Details about the Value

_required_

1.  Address common questions that one might have while looking at the example. (Blockquotes are great for this)
2.  Show examples of common missteps and how they can be avoided.
3.  Show very simple code samples of good and bad patterns.
4.  Discuss why this may be a compelling pattern. Links for reference are not required but encouraged.

### Real-World Example

_required_

Demonstrate the code that would power a common or interesting use case, either by:

1.  Walking through a few terse examples of setup, or
2.  Embedding a codepen/jsfiddle example

If you choose to do the latter, you should still talk through what it is and does.

### Additional Context

_optional_

It's extremely helpful to write a bit about this pattern, where else it would apply, why it works well, and run through a bit of code as you do so or give people further reading materials here.

### When To Avoid This Pattern

_optional_

This section is not required, but heavily recommended. It won't make sense to write it for something very simple such as toggling classes based on state change, but for more advanced patterns like mixins it's vital. The answer to most questions about development is ["It depends!"](https://codepen.io/rachsmith/pen/YweZbG), this section embraces that. Here, we'll take an honest look at when the pattern is useful and when it should be avoided, or when something else makes more sense.

### Alternative Patterns

_required_

This section is required when you've provided the section above about avoidance. It's important to explore other methods so that people told that something is an antipattern in certain situations are not left wondering. In doing so, consider that the web is a big tent and that many people have different codebase structures and are solving different goals. Is the app large or small? Are they integrating Vue into an existing project, or are they building from scratch? Are their users only trying to achieve one goal or many? Is there a lot of asynchronous data? All of these concerns will impact alternative implementations. A good cookbook recipe gives developers this context.

## Thank you

It takes time to contribute to documentation, and if you spend the time to submit a PR to this section of our docs, you do so with our gratitude.
