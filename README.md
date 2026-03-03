# Welsh Corgi

<div align="center">
    <img src="./assets/corgi.png" width="200">
</div>

Zero-dependency message alert js library written in pure javascript. It can be used anywhere: React, Vue, Angular, Svelte, solid-js...

## Installation

```
npm i welsh-corgi
```

## Basic Usage

```typescript
import "welsh-corgi/dist/index.css";
import { corgi } from "welsh-corgi";

corgi.info("This is a INFO message!");
corgi.success("This is a persistent SUCCESS message!", { live: 0 });
corgi.warn("This is a WARNING message!");
corgi.error("This is a ERROR message!");
corgi.ask("Do you want to quit?");
```

## Advanced Options

```typescript
type RichContent = string | HTMLElement | { html: string };

type Options = {
  title?: RichContent;
  live?: number;
};

interface AskConfig {
  danger?: boolean;
  yes?: string;
  no?: string;
  title?: RichContent;
}

declare function ask(
  content: RichContent,
  config?: AskConfig,
): Promise<boolean>;

export declare const corgi: {
  info: (content: RichContent, config?: OtherConfig) => void;
  success: (content: RichContent, config?: OtherConfig) => void;
  warn: (content: RichContent, config?: OtherConfig) => void;
  error: (content: RichContent, config?: OtherConfig) => void;
  ask: typeof ask;
};
```
