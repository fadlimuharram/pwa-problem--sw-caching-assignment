var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event){
  // di gunakan untuk menunggu hingga selesai
  event.waitUntil(
    // akses cache atau buat cache baru jika tidak tersedia
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache){
        //melakukan caching
        cache.addAll([
          '/',
          '/index.html',
          '/src/css/main.css',
          '/src/css/app.css', // di lakukan cache karena di gunakan di multiple page
          '/src/js/main.js', // di lakukan cache karena di gunakan di multiple page
          '/src/js/material.min.js',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
        ])
      })
  );
});

// untuk fetch precached assets dari cache saat di butuhkan
self.addEventListener('fetch', function(event){
  // respond dengan cache asset
  event.respondWith(
    caches.match(event.request)
      .then(function(response){
        if(response){
          return response;
        } else {
          // add  dynamic cache jika if pertama false
          return fetch(event.request)
            .then(function(res){
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache){
                  // put(identifier, respon)
                  // gunakan clone untuk clone respon agar melakukan copy respon
                  // di mana respon selenjutnya akan di teruskan kepada user

                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err){

            });
        }
        
      })
  );
});


self.addEventListener('activate', function(event){
  // melakukan clean up
  event.waitUntil(
    caches.keys()
      .then(function(keyList){
        return Promise.all(keyList.map(function(key){
          if(key !== CACHE_STATIC_NAME){
            return caches.delete(key);
          }
        }));
      })
  )
});

