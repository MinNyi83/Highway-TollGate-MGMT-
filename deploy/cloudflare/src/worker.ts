export interface Env {
  CACHE: KVNamespace;
  DB: D1Database;
  STORAGE: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        platform: 'cloudflare-workers',
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/vehicles') {
      const cacheKey = 'vehicles-list';
      const cached = await env.CACHE.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { results } = await env.DB.prepare('SELECT * FROM vehicles LIMIT 100').all();
      const response = JSON.stringify(results);
      await env.CACHE.put(cacheKey, response, { expirationTtl: 60 });

      return new Response(response, {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/toll-plazas') {
      const { results } = await env.DB.prepare('SELECT * FROM toll_plazas').all();
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname.startsWith('/uploads/')) {
      const key = url.pathname.replace('/uploads/', '');
      const object = await env.STORAGE.get(key);
      if (object) {
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        return new Response(object.body, { headers });
      }
      return new Response('Not found', { status: 404 });
    }

    return new Response('TollGate API - Cloudflare Workers', {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
