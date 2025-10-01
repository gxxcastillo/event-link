# Event Link

EventLink is a decentralized event management platform designed to securely and seamlessly connect people for gatherings and events. Using blockchain technology, EventLink ensures transparent, efficient, and trustworthy event planning and participation.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## The web client

A poc web client for interacting with the event-links program code

## Anchor

Solana program code is written using the Anchor framework. All program code lives in `solana/programs/event-links`. Tests are all written in js and live in `solana/tests`

## Manual verification
