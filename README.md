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
import { corgi } from 'welsh-corgi';

corgi.info('This is a INFO message!');
corgi.success('This is a SUCCESS message!');
corgi.warn('This is a WARNING message!');
corgi.error('This is a ERROR message!');
```

## Advanced Options

```typescript
type RichContent = string | HTMLElement | { html: string };

type Options = {
    title?: RichContent;
    live?: number;
}

corgi.info(content: RichContent, options?: Options);
```
