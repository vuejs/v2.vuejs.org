---
title: Accessibility
type: guide
---

# Accessibility

An accessible website is a website that can be used be anyone—be that a person with a disability, someone on a slow connection, or someone whose mouse has ran out of battery. It's easy to make a website assuming that all our users are using a keyboard, mouse, and screen, and have a way of hearing the sound produced by our websites, but that often isn't true: millions of people around the world have disabilities and are unable to use all the functionality of a computer in the same way most developers do. While they often have tooling to help them, they're relying on the people building the websites to make them accessible and work well with the tooling.

The World Health Organization estimate that 15% of the world's population have some form of disability, 2-4% of them severely so.

In addition to helping users with disabilities, making a website accessible will help the rest of your users, too. Adding subtitles to a video will help both your deaf and hard-of-hearing users and your users who are in a loud environment and can't hear their phone. Similarly, making sure your text isn't too low contrast will help both your low-vision users and your users who are trying to use their phone in bright sunlight.

The W3C have published a list of guidelines for making websites accessible, called the [Web Content Accessibility Guidelines (WCAG)][wcag 2.0]. It's worth a read, but you might find it a bit dry, and it's out of date - it was written before Single Page Applications and libraries like Vue existed so there are no specific guidelines for that.

There are a huge range of disabilities, which can be divided roughly into four categories:

- *Visual impairments*, such as being blind, having low vision, or colourblindness. These people may make text bigger, increase the contrast of their screen, or use a screen reader or braille display.
- *Motor impairments*—a huge category of impairments—can include people who browse using only the keyboard, use voice recognition software, or use [switch technology].
- *Hearing impairments*, from being partially deaf to profoundly deaf.
- *Cognitive impairments*, such as dyslexia, epilepsy, intellectual disabilities, and ADHD (very much not a complete list).

There's a lot of technology that people with disabilities utilise to use their computers, but often that technology isn't useful unless we take measures to ensure it works. For example, low vision users, blind users and users with dyslexia may use screen readers to read out what's on the screen—but if there are images on the page the screen reader won't know what to read out unless we tell it using alt text. This guide will outline a number of common problems people with disabilities have when browsing websites and explain what we can do to help.

## Basic accessibility 

Accessibility in standard websites, such as putting alt text on images and making sure your text is large enough to read, has been covered many times before, so instead of rewriting what has already been said here, here's a couple articles covering the topic:

@todo: add some links

## Accessibility in JavaScript-rich websites

JavaScript allows us to make powerful, interactive websites and applications, with features from animations to client-side routing instead of having to hit the server every time the user goes to a new page. Unfortunately, some accessibility technology, especially screen readers, doesn't work so well with these websites. 

In addition to the guidelines in the articles above and in the [Web Content Accessibility Guidelines (WCAG)][wcag 2.0], we have to take further measures to make sure that by using JavaScript, we're not making our websites inaccessible to screen reader users.

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

### Dynamic content

### Page navigation with client-side routing

## Testing accessibility



[wcag 2.0]: https://www.w3.org/TR/WCAG20/
[switch technology]: https://en.wikipedia.org/wiki/Switch_access