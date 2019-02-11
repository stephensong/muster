---
title: Introducing Muster
author: Laurence Roberts
authorURL: https://github.com/dws-laurence
---

## What the Muster?

At [DWS](https://dws.com), as is common in large organisations, we have a number of teams across the world building apps. Many of our apps share common patterns and complex components, like forex currency pairs, which always want a certain shape of data.

Getting everyone to share a library of UI components with a consistent UX and design is one thing, but to share components already connected to their data was our ambition.

We needed a way of organising all our data, and enable our front end components to query this data, so we chose to structure it as a graph. This let us build a bunch of apps that depended on this graph, and share the logic to fetch and modify the data between all those apps.

We found existing tools had a distinction between local application state and remote application state. But we think these boundaries are more fluid in real applications. So for each app, our approach needed to unify remote data and component state into a single graph, and for modularity, keep data and their operations grouped by subject.

Muster is our solution, a JavaScript library providing a universal data layer for components and services. It currently has a React integration but we are actively looking at targeting other frameworks as well.

This probably sounds similar to [GraphQL](https://graphql.org/), a wonderful tool for abstracting APIs behind a graph. Muster takes this a step further: by putting your operations in the graph, it gives you the power to apply functions to your data, filter and map it right back into a new node, ready to be used by your components.

## Reactive, Lazy, Synchronously Async

Data depends on data depends on components depend on data... It's a messy world and mapping requirements into code often becomes equally messy.

Muster eases this burden. It isolates side-effects and asynchronous code, allowing you to write your graph as though it were synchronous. A node with references to other nodes will react to any changes and update, all the way through to re-rendering components (when using Muster-React).

You can declare your data, where it comes from, how it is modified and how it relates to your components, and all this will only lazily evaluate when something actually requests it.

Pop over to [the FAQs to read more](/muster/docs/resources/faq#why-should-i-use-muster) on this.

## Big and Small, Muster For All

We are a large team, across multiple countries, building products that need to take in a heap of data from a host of APIs into both web and native apps.

We've been able to use Muster as a middleman server to collate data from an array of APIs into a shared graph which any of our apps can then treat as an extension to their own local graph.

Muster is an equal boon when creating smaller apps, helping you keep a central store of data which is then passed through your components.

Take a [look at these example apps](https://github.com/dwstech/muster-examples) to see some possible ways to approach a Muster-based project.

## Sounds 🔥, How Do I Start?

You can experiment using the [Playground](/muster/playground). Be sure to check out the [recursion](/muster/playground/?graph=IntcbiAgW21hdGNoKHR5cGVzLmludGVnZXIsICdpJyldOiB7XG4gICAgZmlib25hY2NpOiBjb21wdXRlZChcbiAgICAgIFtwYXJhbSgnaScpXSxcbiAgICAgIChpKSA9PiAoXG4gICAgICAgIGkgPCAyXG4gICAgICAgICAgPyBpXG4gICAgICAgICAgOiBhZGQocmVmKGkgLSAxLCAnZmlib25hY2NpJyksIHJlZihpIC0gMiwgJ2ZpYm9uYWNjaScpKVxuICAgICAgKVxuICAgIClcbiAgfVxufSI%3D&toggles=eyJzaG93R3JhcGgiOnRydWUsInNob3dRdWVyeSI6dHJ1ZSwic2hvd1F1ZXJ5UmVzdWx0Ijp0cnVlLCJzaG93Q29udGFpbmVyIjpmYWxzZSwic2hvd1ZpZXciOmZhbHNlLCJzaG93Vmlld1Jlc3VsdCI6ZmFsc2V9&query=InJlZigxMCwgJ2ZpYm9uYWNjaScpIg%3D%3D#recursion) and [data fetching](/muster/playground/?graph=IntcbiAgZ3JlZXRpbmc6ICdIZWxsbycsXG4gIHVzZXI6IGZyb21Qcm9taXNlKCgpID0%2BXG4gICAgZmV0Y2goJ2h0dHBzOi8vanNvbnBsYWNlaG9sZGVyLnR5cGljb2RlLmNvbS91c2Vycy8xJylcbiAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgLnRoZW4odXNlciA9PiB1c2VyLm5hbWUpXG4gICksXG4gIHdlbGNvbWU6IGZvcm1hdCgnJHtzYWx1dGF0aW9ufSwgJHtuYW1lfSEnLCB7XG4gICAgc2FsdXRhdGlvbjogcmVmKCdncmVldGluZycpLFxuICAgIG5hbWU6IHJlZigndXNlcicpLFxuICB9KSxcbn0i&toggles=eyJzaG93R3JhcGgiOnRydWUsInNob3dRdWVyeSI6dHJ1ZSwic2hvd1F1ZXJ5UmVzdWx0Ijp0cnVlLCJzaG93Q29udGFpbmVyIjp0cnVlLCJzaG93VmlldyI6dHJ1ZSwic2hvd1ZpZXdSZXN1bHQiOnRydWV9#fetch) examples.

Or install it straight into your project with:

```
npm install @dws/muster @dws/muster-react
```

Then head on over to the [documentation](/muster/docs/overview) for a comprehensive look at all the possibilities, read through the [essential nodes](/muster/docs/resources/essential-nodes) you'll need in most apps, follow the [Muster React tutorial](/muster/docs/tutorials/muster-react-tutorial) and delve deep into [understanding Muster](/muster/docs/understanding-muster/data-store).

It has been nearly three years of work; debugging, refactoring and rebuilding from scratch with new ideas and for new projects. We are so happy to release Muster to you, the vibrant JavaScript community, and to discover what exciting things you will build. Have fun!
