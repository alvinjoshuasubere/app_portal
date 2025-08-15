module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  router: {
    // middleware: ['pageValidator']
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "@/assets/scss/main.scss",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // "~/plugins/elastic.js",
    "~/plugins/fontawesome.js",
  ],

  // export default {
  telemetry: false,
  // },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    "@nuxtjs/axios",
  ],
  /*


   ** Build configuration
   */
  axios: {
    baseURL: "http://192.168.0.101:9000/api-ots",
  },

  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },

  env: {
    imageURL: "http://192.168.0.101:9000",
    socketIO: "http://192.168.0.101:9000",
  },

  server: {
    host: "192.168.0.101",
    port: 1000,
  },
};
