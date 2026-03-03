import './style.css';

interface PopItem {
    id: number;
    el: HTMLElement;
    top: number;
}

enum MsgType {
    Info = 'info',
    Success = 'success',
    Warn = 'warn',
    Error = 'error',
    Ask = 'ask',
}

type RichContent = string | HTMLElement | { html: string };

interface Config {
    type: MsgType;
    content: RichContent;
    title?: RichContent;
    live?: number;
}

type OtherConfig = Omit<Config, 'type' | 'content'>;

const hiddenClass = 'corgi-hidden';
const gap = 20;
const live = 2500;
const pops: PopItem[] = [];
const zIndex = 1000000;

const nextId = (() => {
    let id = 0;
    return () => {
        return id === Number.MAX_SAFE_INTEGER ? 0 : ++id;
    };
})();

function animateOut(id: number) {
    for (let i = 0; i < pops.length; i++) {
        if (pops[i].id === id) {
            const [item] = pops.splice(i, 1);
            item.el.classList.add(hiddenClass);
            item.el.addEventListener('transitionend', () => {
                item.el.remove();
                for (let j = i; j < pops.length; j++) {
                    calcTop(pops[j], pops[j - 1]);
                }
            });
            break;
        }
    }
}

function insertRichContent(parent: HTMLElement, content: RichContent) {
    if (typeof content === 'string') {
        parent.innerText = content;
    } else if (content instanceof HTMLElement) {
        parent.appendChild(content);
    } else if (typeof content === 'object' && 'html' in content) {
        parent.innerHTML = content.html;
    } else {
        console.warn('invalid content. it should be string or HTMLElement');
    }
}

function calcTop(item: PopItem, prev?: PopItem) {
    item.top = prev ? prev.top + prev.el.clientHeight + gap : gap;
    item.el.style.top = item.top + 'px';
}

function createPopElement(id: number, config: Config): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = `corgi-wrapper ${hiddenClass}`;

    const el = document.createElement('div');
    el.className = `corgi ${config.type}`;
    wrapper.appendChild(el);

    const flagEl = document.createElement('span');
    flagEl.className = 'flag';
    el.appendChild(flagEl);

    const mainEl = document.createElement('div');
    mainEl.className = 'corgi-main';
    el.appendChild(mainEl);

    if (config.title) {
        const titleEl = document.createElement('div');
        titleEl.className = 'corgi-title';
        mainEl.appendChild(titleEl);
        insertRichContent(titleEl, config.title);
    }

    const contentEl = document.createElement('div');
    contentEl.className = 'corgi-content';
    insertRichContent(contentEl, config.content);
    mainEl.appendChild(contentEl);

    if (config.type !== MsgType.Ask && (config.live ?? live) <= 0) {
        const closeEl = document.createElement('span');
        closeEl.className = 'corgi-close';
        closeEl.innerText = '×';
        el.appendChild(closeEl);

        closeEl.addEventListener('click', () => {
            animateOut(id);
        });
    }

    return wrapper;
}

function popup(config: Config): number {
    const id = nextId();
    const el = createPopElement(id, config);
    pops.push({ id, top: 0, el });
    calcTop(pops[pops.length - 1], pops[pops.length - 2]);
    document.body.appendChild(el);
    setTimeout(() => {
        el.classList.remove(hiddenClass);
    }, 0);
    const t = config.live ?? live;
    if (t > 0) {
        setTimeout(() => {
            animateOut(id);
        }, live);
    }
    return id;
}

function generate(
    type: MsgType,
): (content: RichContent, config?: OtherConfig) => void {
    return (content: RichContent, config?: OtherConfig) => {
        popup({
            ...config,
            type,
            content,
        });
    };
}

interface AskConfig {
    danger?: boolean;
    yes?: string;
    no?: string;
    title?: RichContent;
}

async function ask(content: RichContent, config?: AskConfig): Promise<boolean> {
    const mask = document.createElement('div');
    mask.classList.add('corgi-mask');
    mask.classList.add('mask-hidden');
    mask.style.zIndex = `${zIndex - 1}`;
    document.body.appendChild(mask);

    const el = document.createElement('div');

    const contentWrapper = document.createElement('div');
    insertRichContent(contentWrapper, content);

    const actionWrapper = document.createElement('div');
    actionWrapper.classList.add('corgi-ask');
    const noBtn = document.createElement('button');
    noBtn.innerText = config?.no ?? 'Cancel';
    noBtn.classList.add('no');
    actionWrapper.appendChild(noBtn);
    const yesBtn = document.createElement('button');
    yesBtn.innerText = config?.yes ?? 'OK';
    yesBtn.classList.add((config?.danger ?? false) ? 'danger' : 'yes');
    yesBtn.style.marginLeft = '10px';
    actionWrapper.appendChild(yesBtn);

    el.appendChild(contentWrapper);
    el.appendChild(actionWrapper);

    const id = popup({
        content: el,
        type: MsgType.Ask,
        live: 0,
        title: config?.title,
    });
    setTimeout(() => {
        mask.classList.remove('mask-hidden');
    }, 0);

    function hide() {
        animateOut(id);
        mask.classList.add('mask-hidden');
        mask.addEventListener('transitionend', () => {
            mask.remove();
        });
    }

    return new Promise((resolve) => {
        yesBtn.addEventListener('click', () => {
            resolve(true);
            hide();
        });
        noBtn.addEventListener('click', () => {
            resolve(false);
            hide();
        });
    });
}

export const corgi = {
    info: generate(MsgType.Info),
    success: generate(MsgType.Success),
    warn: generate(MsgType.Warn),
    error: generate(MsgType.Error),
    ask,
};
