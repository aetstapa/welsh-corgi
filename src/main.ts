import { corgi } from '.';

document.getElementById('info')?.addEventListener('click', () => {
    corgi.info('hello', { live: 0 });
});

document.getElementById('success')?.addEventListener('click', () => {
    corgi.success('success', { live: 0 });
});

document.getElementById('warn')?.addEventListener('click', () => {
    corgi.warn('This is warning message', { title: 'warning!!!' });
});

document.getElementById('error')?.addEventListener('click', () => {
    corgi.error({ html: '<a href="">error</a>' });
});
