// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Virutal Linux Shell - kameHame HA',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ],
            link: [
                { rel: 'icon', type: 'icon', href: 'favicon.ico' },
                { rel: 'stylesheet', href: 'https://use.typekit.net/fhk3ybc.css' },
                { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/firacode@6.2.0/distr/fira_code.css' }
            ]
        },
    },
    modules: ['@nuxtjs/tailwindcss'],
    vite: {
        server: {
            hmr: {
                protocol: 'ws',
                port: 4000,
            }
        }
    },
    devServer: {
        port: 3000
    },
    nitro: {
        preset: 'node-server',
        plugins: ['~/server/index.ts']
    },
    css: [
        '@/assets/css/style.css'
    ],
    runtimeConfig: {
        public: {
            // virtualShell: {
            //     text: [
            //         'Welcome to KameLinux 22.04.8',
            //         '_PDocumentation: https://kame.pro',
            //         '_PLicense and information: https://github.com/kamehame-ha_W',
            //         `_GLast login: ${(new Date).toLocaleDateString()}`
            //     ],
            // }
        }
    }
})
