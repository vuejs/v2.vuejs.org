---
title: Accessibility
type: guide
---

# Accessibility

An accessible website is a website that can be used be anyone—be that a person with a disability, someone on a slow connection, or someone whose mouse has ran out of battery. It's easy to make a website assuming that all our users are using a keyboard, mouse, and screen, and have a way of hearing the sound produced by our websites, but that often isn't true: millions of people around the world have disabilities and are unable to use all the functionality of a computer in the same way most developers do. While they often have tooling to help them, they're relying on the people building the websites to make them accessible and work well with the tooling.

The World Health Organization estimate that 15% of the world's population have some form of disability, 2-4% of them severely so.

In addition to helping users with disabilities, making a website accessible will help the rest of your users, too. Adding subtitles to a video will help both your deaf and hard-of-hearing users, and your users who are in a loud environment and can't hear their phone. Similarly, making sure your text isn't too low contrast will help both your low-vision users, and your users who are trying to use their phone in bright sunlight.

The W3C have published a list of guidelines for making websites accessible, called the [Web Content Accessibility Guidelines (WCAG)][wcag 2.0]. It's worth a read, but you might find it a a bit dry, and it's out of date - it was written before Single Page Applications and libraries like Vue existed so there are no specific guidelines for that.

There are a huge range of disabilities, which can be divided roughly into four categories:

- *Visual impairments*, such as being blind, having low vision, or colourblindness. These people may make text bigger, increase the contrast of their screen, or use a screen reader or braille display.
- *Motor impairments*—a huge category of impairments—can include people who browse using only the keyboard, use voice recognition software, or use [switch technology].
- *Hearing impairments*, from being partially deaf to profoundly deaf.
- *Cognitive impairments*, such as dyslexia, intellectual disabilities, or ADHD (very much not a complete list).

There's a lot of technology that people with disabilities utilise to use their computers, but often that technology isn't useful unless we take measures to ensure it works. For example, low vision users, blind users and users with dyslexia may use screen readers to read out what's on the screen—but if there are images on the page the screen reader won't know what to read out unless we tell it using alt text. This guide will outline a number of common problems people with disabilities have when browsing websites and explain what we can do to help.

- standard a11y stuff
- Content that relies on the mouse (menu bars, dropdowns, controls on mouseover)
- Extended input elements
- Dynamic content (notifications, error messages) and aria-live
- Announcing page navigation


## Testing accessibility



[wcag 2.0]: https://www.w3.org/TR/WCAG20/
[switch technology]: https://en.wikipedia.org/wiki/Switch_access