---
title: Security
type: guide
order: 504
---

## Reporting Vulnerabilities

When a vulnerability is reported, it immediately becomes our top concern, with a full-time contributor dropping everything to work on it. To report a vulnerability, please email [vuejs.org@gmail.com](mailto:vuejs.org@gmail.com).

While the discovery of new vulnerabilities is rare, we also recommend always using the latest versions of Vue and its official companion libraries to ensure your application remains as secure as possible.

## What Vue Does to Protect You

### HTML content

Whether using templates or render functions, content is automatically escaped. That means in this template:

```html
<h1>{{ userProvidedString }}</h1>
```

if `userProvidedString` contained:

```js
'<script>alert("hi")</script>'
```

then it would be escaped to the following HTML:

```html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

thus preventing the script injection. This escaping is done using native browser APIs, like `textContent`, so a vulnerability can only exist if the browser itself is vulnerable.

### Attribute bindings

Similarly, dynamic attribute bindings are also automatically escaped. That means in this template:

```html
<h1 v-bind:title="userProvidedString">
  hello
</h1>
```

if `userProvidedString` contained:

```js
'" onclick="alert(\'hi\')'
```

then it would be escaped to the following HTML:

```html
&quot; onclick=&quot;alert('hi')
```

thus preventing the close of the `title` attribute to inject new, arbitrary HTML. This escaping is done using native browser APIs, like `setAtttribute`, so a vulnerability can only exist if the browser itself is vulnerable.

## Potential Dangers

In any web application, allowing unsanitized, user-provided content to be executed as HTML, CSS, or JavaScript is potentially dangerous, so should be avoided wherever possible. There are times when some risk be acceptable though.

For example, services like CodePen and JSFiddle allow user-provided content to be executed, but it's in a context where this is expected and sandboxed to some extent inside iframes. In the cases when an important feature inherently requires some level of vulnerability, it's up to your team to weigh the importance of the feature against the worst-case scenarios the vulnerability enables.

### Injecting HTML

As you learned earlier, Vue automatically escapes HTML content, preventing you from accidentally injecting executable HTML into your application. However, in cases where you know the HTML is safe, you can explicitly render HTML content:

- Using a template:
  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- Using a render function:
  ```js
  h('div', {
    domProps: {
      innerHTML: this.userProvidedHtml
    }
  })
  ```

- Using a render function with JSX:
  ```jsx
  <div domPropsInnerHTML={this.userProvidedHtml}></div>
  ```

<p class="tip">Note that user-provided HTML can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that HTML can ever be exposed to it. Additionally, allowing users to write their own Vue templates brings similar dangers.</p>

### Injecting URLs

In a URL like this:

```html
<a v-bind:href="userProvidedUrl">
  click me
</a>
```

There's a potential security issue if the URL has not been "sanitized" to prevent JavaScript execution using `javascript:`. There are libraries such as [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) to help with this, but note:

<p class="tip">If you're ever doing URL sanitization on the frontend, you already have a security issue. User-provided URLs should always be sanitized by your backend before even being saved to a database. Then the problem is avoided for _every_ client connecting to your API, including native mobile apps. Also note that even with sanitized URLs, Vue cannot help you guarantee that they lead to safe destinations.</p>

### Injecting Styles

Looking at this example:

```html
<a
  v-bind:href="sanitizedUrl"
  v-bind:style="userProvidedStyles"
>
  click me
</a>
```

let's assume that `sanitizedUrl` has been sanitized, so that it's definitely a real URL and not JavaScript. With the `userProvidedStyles`, malicious users could still provide CSS to "click jack", e.g. styling the link into a transparent box over the "Log in" button. Then if `https://user-controlled-website.com/` is built to resemble the login page of your application, they might have just captured a user's real login information.

You may be able to imagine how allowing user-provided content for a `<style>` element would create an greater vulnerability, giving that user full control over how to style the entire page:

```html
<style>{{ userProvidedStyles }}</style>
```

To keep your users safe from click jacking, we recommend only allowing users full control over CSS inside a sandboxed iframe. Then when allowing control through a style binding, we recommend using its [object syntax](class-and-style.html#Object-Syntax-1) and only allowing users to provide values for the specific properties it's safe for them to control, like this:

```html
<a
  v-bind:href="sanitizedUrl"
  v-bind:style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### Injecting JavaScript

We strongly discourage ever rendering a `<script>` element with Vue, since templates and render functions should never have side effects. However, this isn't the only way to include strings that would be evaluated as JavaScript at runtime.

Every HTML element has attributes with values accepting strings of JavaScript, such as `onclick`, `onfocus`, and `onmouseenter`. Binding user-provided JavaScript to any of these event attributes is a potential security risk, so should be avoided.

<p class="tip">Note that user-provided JavaScript can never be considered 100% safe unless it's in a sandboxed iframe or in a part of the app where only the user who wrote that JavaScript can ever be exposed to it.</p>

## Best Practices

The general rule is that if you allow unsanitized, user-provided content to be executed (as either HTML, JavaScript, or even CSS), you might be opening yourself up to attacks. This advice actually holds true whether using Vue, another framework, or even no framework.

Beyond the recommendations made above for [Potential Dangers](#Potential-Dangers), we also recommend familiarizing yourself with these resources:

- [HTML5 Security Cheat Sheet](https://html5sec.org/)
- [OWASP's Cross Site Scripting (XSS) Prevention Cheat Sheet](https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet)

Then use what you learn to also review the source code of your dependencies for potentially dangerous patterns, if any of them include 3rd-party components or otherwise influence what's rendered to the DOM.

## Backend Coordination

HTTP security vulnerabilities, such as cross-site request forgery (CSRF/XSRF) and cross-site script inclusion (XSSI), are primarily addressed on the backend, so aren't a concern of Vue's. However, it's still a good idea to communicate with your backend team to learn how to best interact with their API, e.g. by submitting CSRF tokens with form submissions.

## Server-Side Rendering (SSR)

There are some additional security concerns when using SSR, so make sure to follow the best practices outlined throughout [our SSR documentation](https://ssr.vuejs.org/) to avoid vulnerabilities.
