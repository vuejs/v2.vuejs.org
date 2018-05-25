---
title: Accessibility
type: guide
---

# Accessibility

An accessible website is a website that can be used by anyone—be that a person with a disability, someone on a slow connection, or someone whose hardware is dated or broken. It's easy to make a website assuming that all our users are using a keyboard, mouse, and screen, and have a way of hearing the sound produced by our websites, but that often isn't true: millions of people around the world have disabilities and are unable to use all the functionality of a computer in the same way most developers do. While they often have tooling to help them, they're relying on the people building the websites to make them accessible and work well with the tooling.

The World Health Organization estimate that 15% of the world's population has some form of disability, 2-4% of them severely so.

In addition to helping users with disabilities, making a website accessible will help the rest of your users, too. Adding subtitles to a video will help both your deaf and hard-of-hearing users and your users who are in a loud environment and can't hear their phone. Similarly, making sure your text isn't too low contrast will help both your low-vision users and your users who are trying to use their phone in bright sunlight.

The W3C have published a list of guidelines for making websites accessible, called the [Web Content Accessibility Guidelines (WCAG)][WCAG 2.0]. It's worth a read, but you might find it a bit dry, and it's out of date - it was written before Single Page Applications and libraries like Vue existed so there are no specific guidelines for that.

There are a huge range of disabilities, which can be divided roughly into four categories:

- *Visual impairments*, such as being blind, having low vision, or colourblindness. These people may make text bigger, increase the contrast of their screen, or use a screen reader or braille display.
- *Motor impairments*—a huge category of impairments—can include people who browse using only the keyboard, use voice recognition software, or use [Switch technology].
- *Hearing impairments*, from being partially deaf to profoundly deaf.
- *Cognitive impairments*, such as dyslexia, epilepsy, intellectual disabilities, and ADHD (very much not a complete list).

There's a lot of technology that people with disabilities utilise to use their computers, but often that technology isn't useful unless we take measures to ensure it works. For example, low vision users, blind users and users with dyslexia may use screen readers to read out what's on the screen—but if there are images on the page the screen reader won't know what to read out unless we tell it using alt text. This guide will outline a number of common problems people with disabilities have when browsing websites and explain what we can do to help.

## Basic accessibility

Accessibility in standard websites, such as putting alt text on images and making sure your text is large enough to read, has been covered many times before. Instead of rewriting what has already been said, here's a few resources to get you started:

### Talks and Videos
- [W3C Web Accessibility Initiative's "Introduction to Web Accessibility and W3C Standards"][W3C Intro]
- [Leonie Watson speaking on "Developer's Guide to Accessibility Mechanics"][Leonie A11y Mechanics]
- [Marcy Sutton speaking on "Innovating with Accessibility in Mind"][Marcy Innovating A11y]
- [Google's "A11ycasts" series with Rob Dodson][A11ycasts]

### Blogs and How-Tos
- [W3C's Web Accessibility Tutorials][W3C Tutorials]
- [The A11y Project][A11y Project]
- [Heydon Pickering's Inclusive Components][Inclusive Components]

## Accessibility in JavaScript-rich websites

JavaScript allows for powerful, interactive websites and applications. Its usage can be simple or complex. Unfortunately, some assistive technologies struggle to support this environment. With this in mind, what can we do to accommodate these tools added needs? 

In addition to the guidelines in the articles above and in the [Web Content Accessibility Guidelines (WCAG)][WCAG 2.0], we have to take further measures to make sure that by using JavaScript, we're not making our websites inaccessible to screen reader users.

### Mouse-only content

There's a significant number of people browsing the web without a mouse—they could be using a screen reader, or they could be using just a keyboard. It's important to make sure that there are no parts of your website that require the use of the mouse to access.

Some common examples of parts of sites that can't be access without a mouse include:

- Buttons or links that aren't using semantic elements or aria roles.
- Menu dropdowns that appear when you mouse over a parent menu item.
- Autocomplete dropdowns and search suggestions that hide when the input element loses focus.
- Controls that appear on mouseover.
- Anything else that relies on the mouse hovering over anything.

@todo: bad example

It's better to make content display on click instead of on hover - or both. For example, a menu that appears on hover and closes when the mouse moves away could continue doing that, but also open or close when clicked, whether with the mouse or the keyboard.

@todo: good example

### Extended input elements

Standard input elements such as text inputs (<input type="text" placeholder="Example text input">) and checkboxes (<input type="checkbox">) often don't look great, so it's fairly common to want to change the appearance of them.

For example, maybe you want to change a checkbox to look like this:

{% raw %}
<div id="example-0" class="demo">
  <div class="toggle-button">
    <div class="toggle-button__handle"></div>
  </div>
</div>
{% endraw %}

You can't just style a checkbox to look like that! You have to create your own component creating every part of the toggle button. Maybe you could do it like this:

```html
<div
  :class="['toggle-button', { 'toggle-button--checked': checked }]"
  @click="checked = !checked">
  <div class="toggle-button__handle"></div>
</div>
```

Once styled with a bit of CSS, this works fine - clicking on the component toggles the `toggle-button--checked` class and we can move the position of the handle using CSS. Here it is:

{% raw %}
<div id="example-1" class="demo">
  <div
    :class="['toggle-button', { 'toggle-button--checked': checked }]"
    @click="checked = !checked">
    <div class="toggle-button__handle"></div>
  </div>
  
  <pre>{ checked: {{ checked }} }</pre>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    checked: false,
  },
})
</script>
<style>
.toggle-button {
  position: relative;

  width: 60px;
  height: 30px;
  
  border-radius: 15px;
  background-color: hsl(0, 75%, 75%);
  
  transition: all 0.3s;
  cursor: pointer;
}

.toggle-button--checked {
  background-color: hsl(240, 75%, 75%);
}

.toggle-button__handle {
  position: absolute;
  top: 3px;
  left: 3px;

  width: 24px;
  height: 24px;
  
  border-radius: 50%;
  background-color: hsl(0, 75%, 35%);
  
  transition: all 0.3s;
}

.toggle-button--checked .toggle-button__handle {
  transform: translateX(30px);
  
  background-color: hsl(240, 75%, 35%);
}
</style>
{% endraw %}

If you click on the toggle button, it seems to work fine. The variable has changed, and the handle has moved - it's obvious what the state of the toggle button is.

However, while we can tell that it is a toggle button by looking at it, the browser has no idea - the browser thinks that it's just two `<div>` elements. This affects two groups of people:

- Keyboard-only users won't be able to move focus to the button, and so can't click on it to toggle it. You can test this yourself by attempting to tab onto the element (start in the input elements at the beginning of this section).
- The element is completely invisible to screen readers, so not only will people using screen readers not be able to change the value of the button, but they won't even know that it is there.

The first problem is fairly easy to solve: you can just add `tabindex="0"` to the element and you can then tab to it. Note in the next demo that the element is given an outline when focused: this is good! It means that users who aren't using a mouse can tell where the focus is.

The second isn't as simple, and there are two ways to solve it:

#### Extend a native input element

The first possible way to solve this problem is to build the component by starting with a native input element, hiding it from displaying, and making our new HTML hidden from screen readers.

For example, with the previous demo, we could have a hidden checkbox input bound to the same variable, like this:

```html
<input v-model="checked" class="sr-only" type="checkbox">
<div
  aria-hidden="true"
  tabindex="0"
  :class="['toggle-button', { 'toggle-button--checked': checked }]"
  @click="checked = !checked">
  <div class="toggle-button__handle"></div>
</div>
```

{% raw %}
<div id="example-2" class="demo">
  <input v-model="checked" class="sr-only" type="checkbox">
  <div
    aria-hidden="true"
    tabindex="0"
    :class="['toggle-button', { 'toggle-button--checked': checked }]"
    @click="checked = !checked">
    <div class="toggle-button__handle"></div>
  </div>
  
  <pre>{ checked: {{ checked }} }</pre>
</div>
<script>
var example1 = new Vue({
  el: '#example-2',
  data: {
    checked: false,
  },
})
</script>
{% endraw %}

The `sr-only` class means that the checkbox is visible only to screen readers, and `aria-hidden="true"` on the toggle button means that it is hidden to screen readers. Screen readers read out the checkbox, and your sighted users see the toggle button as intended—it works for both parties.

#### ARIA attributes

We saw an ARIA (short for [Accessible Rich Internet Applications][WAI-ARIA]) attribute in the previous example to hide the custom HTML from the screen reader. aria-hidden is one of a tonne of attributes that you can add to elements to tell assistive technology such as screen readers what things on the page are.

Check out MDN for a longer read on ARIA: [An overview of accessible web applications and widgets][ARIA MDN].

Additionally, the W3C keeps a detailed guide of usage and examples for ARIA: [Using Aria - W3C Working Draft][Using ARIA]. This also includes a handy list of [ARIA roles][ARIA Roles] and [ARIA states and properties (or attributes)][ARIA States and Properties].

To make first example accessible using ARIA, we have to set the role to "checkbox" and use the `aria-checked` attribute:

```html
<div
  role="checkbox"
  tabindex="0"
  :aria-checked="checked"
  :class="['toggle-button', { 'toggle-button--checked': checked }]"
  @click="checked = !checked">
  <div class="toggle-button__handle"></div>
</div>
```

{% raw %}
<div id="example-3" class="demo">
  <div
    role="checkbox"
    tabindex="0"
    :aria-checked="checked"
    :class="['toggle-button', { 'toggle-button--checked': checked }]"
    @click="checked = !checked">
    <div class="toggle-button__handle"></div>
  </div>
  
  <pre>{ checked: {{ checked }} }</pre>
</div>
<script>
var example1 = new Vue({
  el: '#example-3',
  data: {
    checked: false,
  },
})
</script>
{% endraw %}

Either method of making the custom input element accessible works fine and isn't too difficult to implement.

### Dynamic content

when content is updated, screen readers don't know it has been updated

examples:

- error messages on forms
- new information (eg news, notifications) from server
- requested information finished downloading

you can use aria-live to let the user know that stuff has changed


### Page navigation with client-side routing

when you click a link in a website with server-side routing, the browser knows the page has changed. on a website with client-side routing, the browser doesn't know, so it isn't announced to the user - it just announces that the link has been clicked, not that navigation has occured or what is displayed has changed.

the solution is to announce to the user when the route has changed using a hidden aria-live element.

## Testing accessibility

A simple way to start testing your application for compliance with accessibility guidelines is with an automated testing tool or service. There are many options available. Here are a few to start:
- [aXe Core][aXe Core]
- [WAVE (Web Accessibility Evaluation Tool)][WAVE Tool]
- [AChecker (Web Accessibility Checker)][AChecker]

Don't stop there! While automated tools will help you meet guidelines, testing with your keyboard, a screen reader, and other quick simulations can help to exceed compliance and craft a better experience:
- [Basic screen reader commands for accessibility testing][Basic SR Commands]
- [Testing Using a Screen Reader][SR Testing]
- [The 6 Simplest Web Accessibility Tests Anyone Can Do][6 Simple Tests]

By far, the best method to help the widest range of users to access your application is to test with real people! 
@todo: recommended testing contract services?


[WCAG 2.0]: https://www.w3.org/TR/WCAG20/
[Switch technology]: https://en.wikipedia.org/wiki/Switch_access
[WAI-ARIA]: https://www.w3.org/WAI/standards-guidelines/aria/
[ARIA MDN]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/An_overview_of_accessible_web_applications_and_widgets
[Using ARIA]: https://www.w3.org/TR/using-aria/
[ARIA Roles]: https://www.w3.org/TR/using-aria/#x2-14-1-aria-roles
[ARIA States and Properties]: https://www.w3.org/TR/using-aria/#x2-14-2-aria-states-and-properties-aria-attributes
[aXe Core]:https://www.axe-core.org/
[WAVE Tool]:https://wave.webaim.org/
[AChecker]: https://achecker.ca/checker/
[Basic SR Commands]: https://developer.paciellogroup.com/blog/2015/01/basic-screen-reader-commands-for-accessibility-testing/
[SR Testing]: http://12devsofxmas.co.uk/2016/01/day-8-testing-using-a-screen-reader/
[6 Simple Tests]: http://www.karlgroves.com/2013/09/05/the-6-simplest-web-accessibility-tests-anyone-can-do/
[Inclusive Components]: https://inclusive-components.design/
[Leonie A11y Mechanics]: https://www.youtube.com/watch?v=qi0tY60Hd6M
[Marcy Innovating A11y]: https://www.youtube.com/watch?v=UXCt_85Y3Ek
[A11ycasts]: https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g
[W3C Intro]: https://www.youtube.com/watch?v=20SHvU2PKsM
[A11y Project]: https://a11yproject.com/
[W3C Tutorials]: https://www.w3.org/WAI/tutorials/
