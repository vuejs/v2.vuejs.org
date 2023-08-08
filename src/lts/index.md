# Vue 2 LTS, EOL & Extended Support

<p class="info"><b>Expecting to stay on Vue 2?</b>
If you expect to be using Vue 2 beyond the EOL date (Dec. 31st, 2023), and still need a maintained version that can satisfy security and browser compatibility requirements, make sure to check out [HeroDevs' NES (Never-Ending Support) for Vue 2](https://www.herodevs.com/support/nes-vue?utm_source=vuejs-org&utm_medium=link&utm_campaign=lts-faq).
</p>

## How long will Vue 2 be supported?

Vue 2.7 is the current, and final minor release of Vue 2.x. Vue 2.7 receives 18 months of LTS (long-term support) starting from its release date on July 1st, 2022. During this period, Vue 2 will receive necessary bug and security fixes, but will no longer receive new features.

**Vue 2 will reach End of Life (EOL) on December 31st, 2023**. After that date, Vue 2 will continue to be available in all existing distribution channels (CDNs and package managers), but will no longer receive updates, including security and browser compatibility fixes.

## Options for dealing with EOL

### Upgrade to Vue 3

Vue 3 is the current, latest major version of Vue. It provides better performance, better TypeScript support, and contains new features that are not present in Vue 2, such as Teleport, Suspense, and multiple root elements per template.

Vue 3 contains breaking changes that make it incompatible with Vue 2, so migration will require a certain level of effort depending on your project. Full details are documented in the [Vue 3 Migration Guide](https://v3-migration.vuejs.org/).

Despite the breaking changes, the majority of Vue APIs are shared between the two major versions, so most of your team's Vue 2 knowledge will continue to work in Vue 3. In the long run, we also intend to avoid major breaking upgrades like the one between Vue 2 and Vue 3. Compatibility and ecosystem stability will be our topmost priority for future releases, and new features will be introduced in a way that does not require major migrations.


### Upgrade or not to Upgrade

Whether you should upgrade to Vue 3 highly depends on specific project details. Some general guidelines:

1. Understand what you will gain from upgrading.

   Due to 2.7, the DX gap between the two major versions are no longer that prominent - the main benefit of upgrading will be more refined TypeScript support, better performance, and access to the Vue 3 ecosystem and future new features.

   Ask your team these questions: is the app stable and working well? Does the app expect continued new feature development into the future? Is there a pain-point / bottleneck that can only be solved by upgrading? If the app is stable and isn't experiencing major pain-point caused by Vue 2, then upgrading may not be worthwhile.

2. Understand the cost of upgrading.

   Does the app rely on 3rd party dependencies that are hard to be made Vue 3 compatible? Does the app rely heavily on changed behavior between Vue 2 and Vue 3? Can the team allocate dedicated time for upgrading? Spend some initial research time to gauge these aspects and come up with an estimation, then compare that to the expected gain from (1). We will not be able to provide a precise formula, but hopefully this can help with the decision process.


### Stay on Vue 2

Some teams may not be able to upgrade to Vue 3 by this timeline due to limited bandwidth, budget, risk tolerance, or reliance on Vue-3-incompatible dependencies. We totally understand this, and want to ensure that staying on Vue 2 beyond EOL is a viable option.

#### The Technical Perspective

From a technical perspective, Vue 2 is a stable and battle-tested piece of technology. If it is serving you well now, it will continue to do so for the foreseeable future.

In addition, we have backported some of the most important Vue 3 features to [Vue 2.7](/v2/guide/migration-vue-2-7.html), including Composition API and `<script setup>`. This allows Vue 2 projects to improve scalability, leverage new ecosystem libraries, and better prepare for potential migration to Vue 3.

Vue 2.7 will also be the maintained release before EOL hits, so if you intend to stay on Vue 2, you should at least upgrade to Vue 2.7.

#### Security & Compliance

For some teams, the main concern lies in security, compliance, and browser compatibility.

- You won't receive security fixes from EOL software. For the record, Vue 2 hasn't really had any real vulnerabilities in the past, but you may need a supported version to fullfil regulations or company policies.

- If you are shipping your application to customers with SLAs. You _will_ want to avoid including EOL software in your stack.

- Browsers sometimes ship changes that break legacy libraries. This is extremely rare, but could happen in theory.

To address these concerns, we have partnered with industry experts to provide **Extended LTS for Vue 2**. This service will provide a version of Vue 2 that will continue to receive security and browser compatibility fixes, with SLAs (Service Level Agreements). If you expect to be using Vue 2 beyond the EOL date of December 31st, 2023, make sure to plan ahead: [Learn more about HeroDevs' NES (Never-Ending Support) for Vue 2](https://www.herodevs.com/support/nes-vue?utm_source=vuejs-org&utm_medium=link&utm_campaign=lts-faq).
