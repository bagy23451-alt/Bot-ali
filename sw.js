self.addEventListener('install', () => { self.skipWaiting() });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()) });

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname === '/__dl__') {
        const target = url.searchParams.get('url');
        if (!target) return event.respondWith(new Response('Missing URL', { status: 400 }));
        event.respondWith(
            fetch(target)
                .then(res => {
                    const h = new Headers();
                    h.set('Content-Type', res.headers.get('Content-Type') || 'application/octet-stream');
                    h.set('Access-Control-Allow-Origin', '*');
                    h.set('Access-Control-Expose-Headers', '*');
                    const cl = res.headers.get('Content-Length');
                    if (cl) h.set('Content-Length', cl);
                    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
                })
                .catch(err => new Response('Error: ' + err.message, { status: 500 }))
        );
    }
});
