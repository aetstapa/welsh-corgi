# Welsh Corgi

<div align="center">
    <img src="./assets/corgi.png" width="200">
</div>

Zero-dependency message alert js library write by pure javascript. It is can be used anywhere: React, Vue, Angular, Svelte, solid-js...

## Installation

```
npm i welsh-corgi
```

## Basic Usage

```
import 'welsh-corgi/dist/index.css';
import { welsh, corgi } from 'welsh-corgi';

welsh.info('This is a INFO message!');
welsh.success('This is a SUCCESS message!');
welsh.warn('This is a WARNING message!');
welsh.error('This is a ERROR message!');

corgi.bark('This is a INFO message!');
corgi.yip('This is a SUCCESS message!');
corgi.gruff('This is a WARNING message!');
corgi.snarl('This is a ERROR message!');
```

## Advanced Options

```typescript
type RichContent = string | HTMLElement | { html: string };

type Options = {
    title?: RichContent;
    live?: number;
}

welsh.info(content: RichContent, options?: Options);
```
