---
title: Handling Errors with Error Boundaries
type: cookbook
order: 11
---

## Base Example

Handling JavaScript errors in your Vue components is an integral part of building applications. In some cases, a JavaScript error can break a portion of the UI. This behavior can be avoided with the use of an "error boundary". An error boundary is a component that can catch JavaScript errors within child components and render a fallback UI.

In Vue 2.5.0, the `errorCaptured` hook was introduced which can be used on Vue components. This [hook](https://vuejs.org/v2/api/#errorCaptured) will only capture errors thrown from any descendent components.

```js
export default {
  name: 'ErrorBoundary',
  data: () => ({
    error: false
  }),
  errorCaptured () {
    this.error = true
  },
  render (h) {
    return this.error ? h('p', 'Something went wrong.') : this.slots.default[0]
  }
}
```

<p class="tip">Check the [guide](https://vuejs.org/v2/guide/render-function.html) if you are unfamiliar with `render` functions in Vue.</p>

A component becomes an error boundary when we utilize the `errorCaptured` hook. Any errors thrown from child components will propagate up to the error boundary. If an error is captured we render the fallback UI of `<p>Something went wrong.</p>` instead of the slotted content. Otherwise, the slotted content is displayed.

<p data-height="230" data-theme-id="0" data-slug-hash="VxKXVM" data-default-tab="result" data-user="dchanis" data-embed-version="2" data-pen-title="Vue Cookbook: Error Boundary -- Base Example" class="codepen">See the Pen <a href="https://codepen.io/dchanis/pen/VxKXVM/">Vue Cookbook: Error Boundary -- Base Example</a> by Dillon (<a href="https://codepen.io/dchanis">@dchanis</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

In the example above we click the button until it reaches 0 and we use an error boundary to display the error stack.

## Importance of Error Boundaries

> "Why would I use an error boundary component?"

An error boundary allows our application to be safe from UI breaking JavaScript errors. That means if an unexpected JavaScript error occurs we can safely display a fallback UI so our application can run as normal. Furthermore, errors caught by `errorCaptured` propagate up to Vue's global [`errorHandler`](https://vuejs.org/v2/api/#errorHandler) config. This allows us to log our errors to different error logging services to provide insight on why and where errors occurred for our users.

> "Can I just use a `try/catch`?"

Yes! However, with Vue's component based architecture it makes more sense to utilize components to handle this logic for us. Components allow us to create reusable bits of code. Instead of writing a `try/catch` everywhere an error may occur, we can allow the error boundary to do it for us. This helps to keep our components free from error handling logic.

Error boundaries also allow us to be as granular as we want. We could wrap individual components or entire sections of the application.

## Real-World Example: Contact List

Using the `v-for` directive is a common part of any application. Let's create a `ContactList` component which will display a list of contacts. Then we will explore how using an error boundary could improve our list when errors arise.

### Building the ContactList Component

The `ContactList` component will have an array of contacts which it will need to iterate over using `v-for`.

```html
<template>
  <div>
    <h1>My Contacts</h1>
    <ul class="contact-list">
      <!-- Contact will go here -->
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppContactList',
  data: () => ({
    contacts: [
      { id: 1, name: 'Edgar Degas', phone: '331-827-1917' },
      { id: 2, name: 'Leonardo da Vinci', phone: '331-502-1519' },
      { id: 3, name: 'Mary Cassatt', phone: '412-614-1926' },
      { id: 4, name: 'Bob Ross', phone: '907-704-1995' },
      { id: 5, name: 'Claude Monet', phone: '331-125-1926' }
    ]
  })
}
</script>
```

Our `contacts` array just contains JavaScript objects that describe our contact.

### Building the Contact Component

Each `Contact` component will be responsible for rendering each individual contact within our list of contacts.

```html
<template>
  <li class="contact-list-item">
    <div>
      Name: {{ contact.name }}
    </div>
    <div>
      Phone: {{ contact.phone }}
    </div>
  </li>
</template>

<script>
export default {
  name: 'AppContact',
  props: {
    contact: {
      type: Object,
      required: true
    }
  }
}
</script>
```

Our `Contact` will receive an object as a prop containing the contact's details. Let's update the parent `ContactList` component so we can iterate over our list of `contacts` using this `Contact` component.

```html
<template>
  <div>
    <h1>My Contacts</h1>
    <ul class="contact-list">
      <AppContact v-for="contact in contacts" 
                  :key="contact.id" 
                  :contact="contact" />
    </ul>
  </div>
</template>

<script>
import AppContact from './Contact'

export default {
  name: 'AppContactList',
  components: {
    AppContact
  },
  data: () => ({
    contacts: [
      // contacts...
    ]
  })
}
</script>
```

**Complete Example:**

<p data-height="365" data-theme-id="0" data-slug-hash="bMwOob" data-default-tab="result" data-user="dchanis" data-embed-version="2" data-pen-title="Vue Cookbook: Error Boundary -- Contact List" class="codepen">See the Pen <a href="https://codepen.io/dchanis/pen/bMwOob/">Vue Cookbook: Error Boundary -- Contact List</a> by Dillon (<a href="https://codepen.io/dchanis">@dchanis</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Introducing An Error

Let's update our data source on our `ContactList` component. We will update the phone number to be `null` for one of our contacts. 

`{ id: 2, name: 'Leonardo da Vinci', phone: null }`

In addition, we do not want to show the hyphens on the phone number. Let's create a [filter](https://vuejs.org/v2/guide/filters.html) on our `Contact` component to remove the hyphens in our contact's phone number.

```js
// ...
filters: {
  withoutHyphens (value) {
    return value.replace(/-/g, '')
  }
}
```

And we will update the template code to utilize our new filter.

```html
<div>
  Phone: {{ contact.phone | withoutHyphens }}
</div>
```

The result:

<p data-height="365" data-theme-id="0" data-slug-hash="MGjZqJ" data-default-tab="result" data-user="dchanis" data-embed-version="2" data-pen-title="Vue Cookbook: Error Boundary -- Contact List with Error" class="codepen">See the Pen <a href="https://codepen.io/dchanis/pen/MGjZqJ/">Vue Cookbook: Error Boundary -- Contact List with Error</a> by Dillon (<a href="https://codepen.io/dchanis">@dchanis</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

One of our `Contact` components completely broke! Since our filter is trying to utilize the [`.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) String method on a `null` value we get an error.

### Introducing the Error Boundary

Let's see how the error boundary component we defined above can help us. As a reminder, error boundary components wrap existing components that may cause an error. Currently, one of our `Contact` components is throwing an error which is causing nothing to render in its place. We need to update our `ContactList` template to utilize our `ErrorBoundary`.

```html
<ul class="contact-list">
  <template v-for="contact in contacts">
    <ErrorBoundary :key="contact.id">
      <AppContact :contact="contact" />
    </ErrorBoundary>
  </template>
</ul>
```

<p data-height="365" data-theme-id="0" data-slug-hash="MGjLKE" data-default-tab="result" data-user="dchanis" data-embed-version="2" data-pen-title="Vue Cookbook: Error Boundary -- Contact List with Error Boundary" class="codepen">See the Pen <a href="https://codepen.io/dchanis/pen/MGjLKE/">Vue Cookbook: Error Boundary -- Contact List with Error Boundary</a> by Dillon (<a href="https://codepen.io/dchanis">@dchanis</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

This is a little better. Thanks to our error boundary we at least get a message that one of the contacts did not load correctly.  Let's update our `ErrorBoundary` component to be a little more extendable. 

### Extending our ErrorBoundary component

Ideally the error boundary component displays a fallback UI that is relevant to the context it is being rendered in. Since the error boundary is just a component we can still have it receive props. We can update the component definition so that it receives a component as a prop to display instead of a static message.

```js
export default {
  name: 'ErrorBoundary',
  props: {
    fallBack: {
      type: Object
    }
  },
  data: () => ({
    error: false
  }),
  errorCaptured () {
    this.error = true
  },
  render (h) {
    return this.error ? h(this.fallBack) : this.slots.default[0]
  }
}
```

We can then create a fallback component to render in case of an error.

```html
<template functional>
  <li class="contact-list-item">
    <div>
      Sorry! We're having trouble obtaining the contact's information.
    </div>
  </li>
</template>

<script>
export default {
  functional: true
}
</script>
```

And then we can import this component and pass it into our `ErrorBoundary` component as a prop.

```html
<ul class="contact-list">
  <template v-for="contact in contacts">
    <ErrorBoundary :fall-back="ContactError" :key="contact.id">
      <AppContact :contact="contact" />
    </ErrorBoundary>
  </template>
</ul>

<script>
import ContactError from './components'

// ...
data: () => ({
  ContactError
})
</script>
```

**Complete Example:**

<p data-height="365" data-theme-id="0" data-slug-hash="LmbqNJ" data-default-tab="result" data-user="dchanis" data-embed-version="2" data-pen-title="Vue Cookbook: Error Boundary -- Contact List with Error Boundary Pt. 2" class="codepen">See the Pen <a href="https://codepen.io/dchanis/pen/LmbqNJ/">Vue Cookbook: Error Boundary -- Contact List with Error Boundary Pt. 2</a> by Dillon (<a href="https://codepen.io/dchanis">@dchanis</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## When to Avoid This Pattern

Error boundaries are great but they come with a few caveats. The `errorCaptured` hook will only capture errors in a few situations.

- render functions
- watch callbacks
- lifecycle hooks
- component event handlers

DOM event handlers are not included in this. This means if you're `@click` directive or similar directive throws an error the `errorCaptured` hook will not handle it.  Instead, refer to the alternative patterns available.

Another scenario we would want to avoid using an error boundary is when we are wrapping a functional component as explained in this [issue](https://github.com/vuejs/vue/issues/7009).

Error boundaries should also only be used for displaying production level messages for the end user. Since `errorCaptured` will send all errors to the global `config.errorHandler` we should utilize the `errorHandler` to send all error data to an analytics service rather than in our error boundary.

## Alternative Patterns

Since error boundaries act very similarly to [`try/catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) we can still utilize them to handle errors in the cases where error boundaries will not work.
