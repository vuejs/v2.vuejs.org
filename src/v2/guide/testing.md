---
title: Testing
type: guide
order: 402
---

## Introduction

When it comes to building reliable applications, tests can play a critical role in an individual or team's ability to build new features, refactor code, fix bugs, etc. While there are many schools of thought with testing, there are three categories often discussed in the context of web applications:

- Unit Testing
- Component Testing
- End-To-End (E2E) Testing

This section aims to provide guidance to navigating the testing ecosystem and choosing the right tools for your Vue application or component library.

## Unit Testing

### Introduction

Unit tests allow you to test individual units of code in isolation. The purpose of unit testing is to provide developers with confidence in their code. By writing thorough, meaningful tests, you achieve the confidence that as new features are built or your code is refactored your application will remain functional and stable.

Unit testing a Vue application does not significantly differ from testing other types of applications.

### Choosing Your Framework

Since unit testing advice is often framework-agnostic, here are some basic guidelines to keep in mind when evaluating which unit testing tool is best for your application.

#### First-class error reporting

When tests fail, it is critical that your unit testing framework provides useful errors. This is the job of the assertion library. An assertion with high-quality error messages helps minimize the amount of time it takes to debug the problem. In addition to simply telling you what test is failing, assertion libraries provide context for why a test fails, e.g., what is expected vs what was received.

Some unit testing frameworks, like Jest, include assertion libraries. Others, like Mocha, require you to install assertion libraries separately (usually Chai).

#### Active community and team

Since the majority of unit testing frameworks are open-source, having a community that is active can be critical to some teams that will be maintaining their tests for a long period of time and needs to ensure that a project will be actively maintained. In addition, having an active community has the benefit of providing more support whenever you run into issues.

### Frameworks

While there are many tools in the ecosystem, here are some common unit testing tools that are being used in the Vue.js ecosystem.

#### Jest

Jest is a JavaScript test framework that is focused on simplicity. One of its unique features is the ability to take snapshots of tests in order to provide an alternative means of verifying units of your application.

**Resources:**

- [Official Jest Website](https://jestjs.io)
- [Official Vue 2 CLI Plugin - Jest](https://cli.vuejs.org/core-plugins/unit-jest.html)

#### Mocha

Mocha is a JavaScript test framework that is focused on being flexible. Because of this flexibility, it allows you to choose different libraries to fulfill other common features such as spying (e.g., Sinon) and assertions (e.g., Chai). Another unique feature of Mocha is that it can also execute tests in the browser in addition to Node.js.

**Resources:**

- [Official Mocha Website](https://mochajs.org)
- [Official Vue CLI Plugin - Mocha](https://cli.vuejs.org/core-plugins/unit-mocha.html)

## Component Testing

### Introduction

To test most Vue components, they must be mounted to the DOM (either virtual or real) in order to fully assert that they are working. This is another framework-agnostic concept. As a result, component testing frameworks were created to give users the ability to do this reliably while also providing Vue-specific conveniences such as integrations for Vuex, Vue Router, and other Vue plugins.

### Choosing Your Framework

The following section provides guidelines on things to keep in mind when evaluating which component testing framework is best for your application.

#### Optimal compatibility with the Vue ecosystem

It should be no surprise that one of the first criteria is that a component testing library should have is being as compatible with the Vue ecosystem as possible. While this may seem comprehensive, some key integration areas to keep in mind include single file components (SFCs), Vuex, Vue Router, and any other Vue specific plugins that your application relies on.

#### First-class error reporting

When tests fail, it is critical that your component testing framework provides useful error logs that help to minimize the amount of time it takes to debug the problem. In addition to simply telling you what test fails, they should also provide context for why a test fails, e.g., what is expected vs what was received.

### Recommendations

#### Vue Testing Library (@testing-library/vue)

Vue Testing Library is a set of tools focused on testing components without relying on implementation details. Built with accessibility in mind, its approach also makes refactoring a breeze.

Its guiding principle is that the more tests resemble the way software is used, the more confidence they can provide.

**Resources:**

- [Official Vue Testing Library Website](https://testing-library.com/docs/vue-testing-library/intro)

#### Vue Test Utils

Vue Test Utils is the official low-level component testing library that was written to provide users access to Vue specific APIs. If you are new to testing Vue applications, we would recommend using Vue Testing Library, which is an abstraction over Vue Test Utils.

**Resources**

- [Official Vue Test Utils Documentation](https://vue-test-utils.vuejs.org)
- [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/#what-is-this-guide) by Lachlan Miller
- [Cookbook: Unit Testing Vue Components](/v2/cookbook/unit-testing-vue-components.html)

## End-to-End (E2E) Testing

### Introduction

While unit tests provide developers with some degree of confidence, unit and component tests are limited in their abilities to provide holistic coverage of an application when deployed to production. As a result, end-to-end (E2E) tests provide coverage on what is arguably the most important aspect of an application: what happens when users actually use your applications.

In other words, E2E tests validate all of the layers in your application. This not only includes your frontend code, but all associated backend services and infrastructure that are more representative of the environment that your users will be in. By testing how user actions impact your application, E2E tests are often the key to higher confidence in whether an application is functioning properly or not.

### Choosing Your Framework

While end-to-end (E2E) testing on the web has gained a negative reputation for unreliable (flaky) tests and slowing down development processes, modern E2E tools have made strides forward to create more reliable, interactive, and useful tests. When choosing an E2E testing framework, the following sections provide some guidance on things to keep in mind when choosing a testing framework for your application.

#### Cross-browser testing

One of the primary benefits that end-to-end (E2E) testing is known for is its ability to test your application across multiple browsers. While it may seem desirable to have 100% cross-browser coverage, it is important to note that cross browser testing has diminishing returns on a team's resources due the additional time and machine power required to run them consistently. As a result, it is important to be mindful of this trade-off when choosing the amount of cross-browser testing your application needs.

<p class="tip">A recent development in E2E for catching browser-specific issues is using application monitoring and error reporting tools (e.g., Sentry, LogRocket, etc.) for browsers that are not as commonly used (e.g., < IE11, older Safari versions, etc.).</p>

#### Faster feedback loops

One of the primary problems with end-to-end (E2E) tests and development is that running the entire suite takes a long time. Typically, this is only done in continuous integration and deployment (CI/CD) pipelines. Modern E2E testing frameworks have helped to solve this by adding features like parallelization, which allows for CI/CD pipelines to often run magnitudes faster than before. In addition, when developing locally, the ability to selectively run a single test for the page you are working on while also providing hot reloading of tests can help to boost a developer's workflow and productivity.

#### First class debugging experience

While developers have traditionally relied on scanning logs in a terminal window to help determine what went wrong in a test, modern end-to-end (E2E) test frameworks allow developers to leverage tools that they are already familiar with, e.g. browser developer tools.

#### Visibility in headless mode

When end-to-end (E2E) tests are run in continuous integration / deployment pipelines, they are often run in headless browsers (i.e., no visible browser is opened for the user to watch). As a result, when errors occur, a critical feature that modern E2E testing frameworks provide 1st class support for is the ability to see snapshots and/or videos of your applications during various testing stages in order to provide insight into why errors are happening. Historically, it was tedious to maintain these integrations.

### Recommendations

While there are many tools in the ecosystem, here are some common end-to-end (E2E) testing frameworks that are being used in the Vue.js ecosystem.

#### Cypress.io

Cypress.io is a testing framework that aims to enhance developer productivity by enabling developers to reliably test their applications while providing a first class developer experience.

**Resources**

- [Cypress' Official Website](https://www.cypress.io)
- [Official Vue CLI Cypress Plugin](https://cli.vuejs.org/core-plugins/e2e-cypress.html)
- [Cypress Testing Library](https://github.com/testing-library/cypress-testing-library)

#### Nightwatch.js

Nightwatch.js is an end-to-end testing framework that can be used to test web applications and websites, as well as Node.js unit and integration testing.

**Resources:**

- [Nightwatch's Official Website](https://nightwatchjs.org)
- [Official Vue CLI Nightwatch Plugin](https://cli.vuejs.org/core-plugins/e2e-nightwatch.html)

#### Puppeteer

Puppeteer is a Node library that provides a high-level API to control the browser and can pair with other test runners (e.g., Jest) to test your application.

**Resources:**

- [Puppeteer's Official Website](https://pptr.dev)

#### TestCafe

TestCafe is a Node.js based end-to-end framework that aims to provide easy setup so that developers can focus on creating tests that are easy to write and reliable.

**Resources:**

- [TestCafe's Official Website](https://devexpress.github.io/testcafe/)
