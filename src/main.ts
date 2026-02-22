import { corgi } from '.';

document.getElementById('info')?.addEventListener('click', () => {
    corgi.bark('hello', { live: 0 });
});

document.getElementById('success')?.addEventListener('click', () => {
    corgi.yip('success', { live: 0 });
});

document.getElementById('warn')?.addEventListener('click', () => {
    corgi.gruff('This is warning message', { title: 'warning!!!' });
});

document.getElementById('error')?.addEventListener('click', () => {
    corgi.snarl({ html: '<a href="">error</a>' });
});
