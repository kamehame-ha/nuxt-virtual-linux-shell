export default defineNuxtConfig({
    app: {
        head: {
            title: 'Virutal Linux Shell - kameHame HA',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            link: [
                { rel: 'icon', type: 'image/png', href: '/avatar.png' },
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
    runtimeConfig: {
        public: {
            virtualShell: {
                info: {
                    username: 'newbie',
                    host: 'test-vm'
                },
                startupLogin: {
                    user: 'newbie',
                    password: '123456789linux'
                }
            }
        }
    },
    ssr: true
})
