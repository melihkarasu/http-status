const HTTP_CODES = [
  { code: 200, title: 'OK', category: '2xx Başarılı', desc: 'İstek başarıyla karşılandı ve yanıt gövdesi istemciye iletildi.', catImg: 'https://http.cat/200' },
  { code: 201, title: 'Created', category: '2xx Başarılı', desc: 'İstek başarılı oldu ve sunucuda yeni bir kaynak oluşturuldu (ör. POST kaydı).', catImg: 'https://http.cat/201' },
  { code: 204, title: 'No Content', category: '2xx Başarılı', desc: 'İstek başarılı oldu ancak geri dönecek herhangi bir gövde (body) içeriği yok.', catImg: 'https://http.cat/204' },
  { code: 301, title: 'Moved Permanently', category: '3xx Yönlendirme', desc: 'İstenen kaynak kalıcı olarak yeni bir URL adresine taşındı; SEO için kritik.', catImg: 'https://http.cat/301' },
  { code: 304, title: 'Not Modified', category: '3xx Yönlendirme', desc: 'Kaynak önbellekten beri değişmedi (ETag/Cache-Control), tekrar indirilmez.', catImg: 'https://http.cat/304' },
  { code: 400, title: 'Bad Request', category: '4xx İstemci Hatası', desc: 'Sunucu, geçersiz sözdizimi veya eksik parametre nedeniyle isteği işleyemedi.', catImg: 'https://http.cat/400' },
  { code: 401, title: 'Unauthorized', category: '4xx İstemci Hatası', desc: 'Kimlik doğrulama gereklidir; geçerli bir Bearer Token veya API anahtarı eksik.', catImg: 'https://http.cat/401' },
  { code: 403, title: 'Forbidden', category: '4xx İstemci Hatası', desc: 'Kimlik doğrulansa dahi kullanıcının bu kaynağa erişim yetkisi (RBAC) bulunmuyor.', catImg: 'https://http.cat/403' },
  { code: 404, title: 'Not Found', category: '4xx İstemci Hatası', desc: 'İstenen uç nokta veya kaynak sunucuda bulunamadı.', catImg: 'https://http.cat/404' },
  { code: 418, title: "I'm a Teapot", category: '4xx Esprili / RFC 2324', desc: '1 Nisan 1998 HTCPFC protokolü şakası: "Ben bir çaydanlığım, kahve yapamam."', catImg: 'https://http.cat/418' },
  { code: 429, title: 'Too Many Requests', category: '4xx İstemci Hatası', desc: 'Hız limiti (Rate Limit) aşıldı; istemci belirlenen sürede çok fazla istek gönderdi.', catImg: 'https://http.cat/429' },
  { code: 500, title: 'Internal Server Error', category: '5xx Sunucu Hatası', desc: 'Sunucu tarafında beklenmeyen bir istisna (crash/exception) meydana geldi.', catImg: 'https://http.cat/500' },
  { code: 502, title: 'Bad Gateway', category: '5xx Sunucu Hatası', desc: 'Ters vekil (Reverse Proxy / Nginx), arka uç uygulamasından geçersiz yanıt aldı.', catImg: 'https://http.cat/502' },
  { code: 503, title: 'Service Unavailable', category: '5xx Sunucu Hatası', desc: 'Sunucu aşırı yük altında veya bakım modunda olduğundan geçici olarak kapalı.', catImg: 'https://http.cat/503' }
];

let allStatuses = [];

        // Standalone: veri gömülü (backend'teki statik HTTP kodları kütüphanesiyle birebir)
        function loadStatuses() {
          allStatuses = HTTP_CODES;
          filterStatusCodes();
        }

        function filterStatusCodes() {
          const q = (document.getElementById('status-search').value || '').trim().toLowerCase();
          const cat = document.getElementById('status-cat-select').value;

          const list = allStatuses.filter(s => {
            const matchQ = !q || String(s.code).includes(q) || s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
            const matchCat = cat === 'all' || s.category.includes(cat);
            return matchQ && matchCat;
          });

          renderGrid(list);
        }

        function renderGrid(list) {
          const grid = document.getElementById('status-grid');
          if (list.length === 0) {
            grid.innerHTML = '<div class="col-span-full py-12 text-center text-mistral-stone font-medium text-sm">Arama kriterlerine uygun HTTP kodu bulunamadı.</div>';
            return;
          }

          grid.innerHTML = list.map(s => {
            let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            if (s.code >= 300 && s.code < 400) badgeBg = 'bg-blue-50 text-blue-800 border-blue-200';
            if (s.code >= 400 && s.code < 500) badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
            if (s.code >= 500) badgeBg = 'bg-rose-50 text-rose-800 border-rose-200';

            return `
              <div onclick="openModal(${s.code})" class="p-5 rounded-xl bg-white border border-mistral-hairline hover:border-mistral-orange/40 hover:shadow-md transition duration-200 flex flex-col justify-between group cursor-pointer">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-2xl font-bold font-mono text-mistral-ink group-hover:text-mistral-orange transition">${s.code}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}">
                      ${s.category.split(' ')[0]}
                    </span>
                  </div>
                  <h4 class="text-base font-bold font-editorial text-mistral-ink mb-1.5 truncate">${s.title}</h4>
                  <p class="text-xs text-mistral-slate line-clamp-2 leading-relaxed">
                    ${s.desc}
                  </p>
                </div>

                <div class="pt-3 mt-4 border-t border-mistral-hairline flex items-center justify-between text-xs font-semibold text-mistral-orange">
                  <span>Detayları İncele &rarr;</span>
                  <span class="text-[10px] text-mistral-stone font-mono">RFC Standart</span>
                </div>
              </div>
            `;
          }).join('');
        }

        function openModal(code) {
          const s = allStatuses.find(x => x.code === code);
          if (!s) return;

          document.getElementById('m-code').innerText = s.code;
          document.getElementById('m-title').innerText = s.title;
          document.getElementById('m-category').innerText = s.category.toUpperCase();
          document.getElementById('m-desc').innerText = s.desc;
          document.getElementById('m-img').src = s.catImg;
          document.getElementById('m-curl').innerText = `curl -I https://httpstat.us/${s.code}`;

          document.getElementById('status-modal').classList.remove('hidden');
        }

        function closeModal() {
          document.getElementById('status-modal').classList.add('hidden');
        }

        function detectHardware() {
          document.getElementById('hw-screen').innerText = `${window.screen.width} x ${window.screen.height}`;
          document.getElementById('hw-dpr').innerText = (window.devicePixelRatio || 1) + 'x';
          document.getElementById('hw-cores').innerText = (navigator.hardwareConcurrency || '-') + ' Çekirdek';
          document.getElementById('hw-online').innerText = navigator.onLine ? 'Çevrimiçi' : 'Çevrimdışı';
          document.getElementById('hw-lang').innerText = navigator.language || 'tr-TR';

          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
              const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
              const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'WebGL Destekli';
              document.getElementById('hw-gpu').innerText = renderer.replace(/ANGLE \\(|\\)/g, '').split(',')[0].slice(0, 30);
            } else {
              document.getElementById('hw-gpu').innerText = 'WebGL Kapalı';
            }
          } catch(e) {
            document.getElementById('hw-gpu').innerText = 'Standart GPU';
          }
        }

        document.addEventListener('DOMContentLoaded', () => {
          loadStatuses();
          detectHardware();
        });
