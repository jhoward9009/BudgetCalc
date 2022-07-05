const APP_PREFIX = 'BUDGETCALC-'
const VERSION = 'version_1.0'
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
    './index.html',
    './js/index.js',
    './css/styles.css'
]

self.addEventListener('fetch', function (event){
    event.respondWith(
        caches.match(e.request).then(function(request){
            // if (request){
            //     return request
            // }else{
            //     return fetch(e.request)
            // }
            return request || fetch(e.request)
        })
    )
})


self.addEventListener('install', function (event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})


self.addEventListener('activiate', function (event){
    event.waitUntil(
        caches.keys().then(function (keys) {
            let keeper = keys.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })

            keeper.push(CACHE_NAME)

            return Promise.all(
                keys.map(function (key, i) {
                    if (keeper.indexOf(key) === -1) {
                        return caches.delete(keys[i])
                    }
                })
            )
        })
    )
})