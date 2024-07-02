# Vue 2 Has Reached End of Life

Vue 2.0 was released more than 7 years ago in 2016. It was a major milestone in Vue's journey of becoming a mainstream framework. Many current Vue users started using Vue during the Vue 2 era, and many great things have been built with it.

However, active maintenance of two major versions in parallel isn't sustainable for us. As Vue 3 and its ecosystem have matured, it is time for the team to move on and focus our energy on the latest major version.

**Vue 2 has reached End of Life on December 31st, 2023. It no longer receives new features, updates, or fixes. However, it is still available on all existing distribution channels (CDNs, package managers, Github, etc).**

If you are starting a new project, please start with the [latest version of Vue (3.x)](https://vuejs.org/). We also strongly recommend current Vue 2 users to upgrade ([guide](https://v3-migration.vuejs.org/)), but we also acknowledge that not all users have the bandwidth or incentive to do so. 

> **If you have to stay on Vue 2 but also have compliance or security requirements about unmaintained software, get [security updates for Vue 2 from HeroDevs](https://www.herodevs.com/support/nes-vue)**



## What’s Next

Vue 3 has been the default version of Vue since February 7, 2022. Users who have migrated have enjoyed:

* Better performance with a smaller bundle size and faster rendering.
* Enhanced TypeScript support for easier large-scale application development.
* More efficient Proxy-based reactivity system.
* New built-in components like Fragment, Teleport, and Suspense.
* Improved build tooling support and Vue Devtools experience.
* …and more!

When and if you can, consider migrating!

## Still on Vue 2? Here Are Your Options.

Recognizing the various situations that arise during transitions, we are also fully aware that users may need other options until they’re able to migrate, or maybe migration simply isn't a feasible path. Here are some other options to consider.


### Update to the Vue 2 Final Release

The latest release of Vue 2, 2.7.16, is the final release of Vue 2. This patch release includes a few final fixes for 2.7 features and improves type alignment with Vue 3. We strongly encourage you to update to 2.7.16. This will be the starting point for extended support mentioned below.

### Purchase Extended Support for Vue 2

If you have to stay on Vue 2 post-EOL, we have partnered with HeroDevs to offer Never-Ending Support (NES). Vue 2 NES provides ongoing updates and security patches for Vue 2 even after EOL so that applications with strict compliance requirements remain secure and compliant. It also guarantees that Vue 2 applications will continue to operate effectively in modern browsers and maintain compatibility with essential libraries like Nuxt, Vuex, and Vuetify 2. Finally, Vue 2 NES has continuous security monitoring and a 14-day SLA for fixes.

Vue 2 NES is the continuation of the support you’ve enjoyed during the Vue 2 LTS period — but indefinitely. For more detailed information, visit the [HeroDevs Vue 2 NES page](https://www.herodevs.com/support/nes-vue?utm_source=vuejs-org&utm_medium=blog&utm_campaign=eol-by-eoy).


### Notify Your Users of your Vue 2 Post-EOL Plan 

If you can’t migrate to Vue 3 or use Vue 2 NES at the moment but still remain on Vue 2, you may need to consider how you will communicate your Vue 2 security plans to your customers.

This does not apply to all Vue users, but many teams are prohibited from shipping _unsupported software_ by SLAs, Contracts & Agreements, or other obligations to downstream parties. These could be with customers, compliance agencies, or even internal company departments. For an increasing number of industries, governing regulatory bodies are also raising expectations on what software creators are accountable for.

If you work with such business requirements, You may need to let your customers, managers, CISO, or other relevant stakeholders, know about your plan to manage support and address any potential CVEs. [Vue 2 hasn’t had major vulnerabilities](https://v2.vuejs.org/lts/#:~:text=For%20the%20record%2C%20Vue%202%20hasn%E2%80%99t%20really%20had%20any%20real%20vulnerabilities%20in%20the%20past%2C%20but%20you%20may%20need%20a%20supported%20version%20to%20fullfil%20regulations%20or%20company%20policies.) in the past, but CVEs do turn up for even the most mature EOL projects — whether directly or via compromised dependencies. Subscribing to CVE notifications through organizations like [OpenCVE](https://www.opencve.io/) and [Snyk](https://snyk.io) can be a good way to find out about vulnerabilities as soon as they’re discovered. Browsers may also ship changes that break legacy libraries - this is rare, but it does happen.
