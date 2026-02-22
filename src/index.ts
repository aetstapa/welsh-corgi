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

const nextId = (() => {
    let id = 0;
    return () => {
        return id === Number.MAX_SAFE_INTEGER ? 0 : ++id;
    };
})();

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

function removeById(id: number) {
    for (let i = 0; i < pops.length; i++) {
        if (pops[i].id === id) {
            const [item] = pops.splice(i, 1);
            item.el.remove();
            for (let j = i; j < pops.length; j++) {
                calcTop(pops[j], pops[j - 1]);
            }
            break;
        }
    }
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

    if ((config.live ?? live) <= 0) {
        const closeEl = document.createElement('span');
        closeEl.className = 'corgi-close';
        closeEl.innerText = '×';
        el.appendChild(closeEl);

        closeEl.addEventListener('click', () => {
            removeById(id);
        });
    }

    return wrapper;
}

function popup(config: Config) {
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
            if (pops.some((item) => item.id === id)) {
                el.classList.add(hiddenClass);
                el.addEventListener('transitionend', () => {
                    removeById(id);
                });
            }
        }, live);
    }
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

export const corgi = {
    info: generate(MsgType.Info),
    success: generate(MsgType.Success),
    warn: generate(MsgType.Warn),
    error: generate(MsgType.Error),
};
