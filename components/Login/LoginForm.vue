<template>
  <body>
    <!-- HEADER -->
    <header class="portal-header">
      <div class="logo-container">
        <img src="city_logo.png" alt="Portal Logo" class="logo" />
        <img src="ict_logo.png" alt="ICT Logo" class="ict-logo" />
        <div class="site-info">
          <h1>Koronadal City Portal</h1>
          <p>Your gateway to everything you need</p>
        </div>
      </div>
    </header>

    <main>
      <section class="welcome">
        <h2 class="titleHeaderName">Koronadal City Portal</h2>
        <p>
          Here you can access the links of all the system that are being used by
          the City Government of Koronadal.
        </p>
      </section>
      <hr />
      <section class="systems-container">
        <div class="systems">
          <h6 class="text-center titleName mb-4">
            Web based Applications <br />
            <small style="font-size: 0.8rem; color: #555"
              >is a program you access through a web browser over the internet.
              You don’t need to install anything — you just visit a URL.
            </small>
          </h6>
          <a
            v-for="(system, index) in systems"
            :key="index"
            :href="system.link"
            target="_blank"
            rel="noopener"
            class="system-card"
          >
            <img :src="system.logo" :alt="system.name" class="system-logo" />
            <div class="system-info">
              <h3 class="appName">{{ system.name }}</h3>
              <p class="subName text-left">{{ system.description }}</p>
            </div>
            <font-awesome-icon
              icon="circle-arrow-right"
              class="viewIcon"
              small
            />
          </a>
        </div>

        <div class="systems">
          <h6 class="text-center titleName mb-4">
            Desktop Applications <br />
            <small style="font-size: 0.8rem; color: #555"
              >is a program installed directly on a computer and runs without
              using a browser.</small
            >
          </h6>

          <a
            v-for="(system, index) in desktop"
            :key="index"
            :href="system.link"
            target="_blank"
            rel="noopener"
            class="desktop-card"
          >
            <img :src="system.logo" :alt="system.name" class="system-logo" />
            <div class="system-info">
              <h3 class="appName">{{ system.name }}</h3>
              <p class="subName text-left">{{ system.description }}</p>
            </div>
            <!-- <font-awesome-icon
              icon="circle-arrow-right"
              class="viewIcon"
              small
            /> -->
          </a>
        </div>
      </section>
    </main>
  </body>
</template>

<script>
import axios from "axios";
import Loading from "@/components/LoadingOverlay/Loadings";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      systems: [
        {
          name: "ICT Online Ticketing System",
          description: "Request ICT services and report issues.",
          logo: "ict_logo.png",
          link: "http://192.168.0.101:3000/",
        },
        {
          name: "Real-Time DTR Tracking System",
          description: "Track daily time records in real-time.",
          logo: "city_logo.png",
          link: "http://192.168.0.101:4000/",
        },
        {
          name: "Motorized Tricycle Operators Permit System",
          description: "Electronic management of tricycle operators' permits.",
          logo: "city_logo.png",
          link: "http://192.168.0.101:4000/",
        },
        {
          name: "Human Resource Management System",
          description: "View payroll, attendance, and salary records.",
          logo: "city_logo.png",
          link: "http://192.168.0.5:60/",
        },
        {
          name: "Budget Management System",
          description: "Manage budget proposals and allocations.",
          logo: "city_logo.png",
          link: "http://192.168.0.5:61/",
        },
        {
          name: "Supply Management System",
          description: "Monitor supply requests and create purchase orders.",
          logo: "city_logo.png",
          link: "http://192.168.0.140:63/",
        },
      ],
      desktop: [
        {
          name: "Property Assessment and Tax Administration System",
          description:
            "Application for the inventory, valuation, assessment, collection and reporting of property taxes.",
          logo: "city_logo.png",
        },
        {
          name: "Project Monitoring System",
          description: "Manage Program and Project Monitoring.",
          logo: "city_logo.png",
        },
        {
          name: "Document Tracking System",
          description:
            "easily locate, update, and verify document status, ensuring accuracy, transparency, and accountability",
          logo: "city_logo.png",
        },
        {
          name: "BRGY. Treasury Operations System",
          description: "Remmitance and collection management of barangays.",
          logo: "city_logo.png",
        },
        {
          name: "CEEDO Treasury Operations System",
          description: "Collection and remittance management for CEEDO.",
          logo: "city_logo.png",
        },
      ],
    };
  },
  beforeCreate() {},

  created() {},
  computed: {},
  methods: {},
};
</script>

<style scoped lang="scss">
/* Reset & Basics */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #fff;
  color: #333;
}

.portal-header {
  background-color: #8b0000;
  color: white;
  padding: 10px 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
}
.ict-logo {
  width: 70px;
  height: 70px;
  border-radius: 8px;
}

.site-info h1 {
  font-size: 1.5rem;
}

.site-info p {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: 0.3s;
}

.nav-links a:hover {
  color: #ffd6d6;
}

/* Search Form */
.search-form {
  display: flex;
}

.search-form input {
  padding: 5px 10px;
  border: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.search-form button {
  padding: 5px 10px;
  background-color: white;
  color: #c00000;
  border: none;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  font-weight: bold;
}

.search-form button:hover {
  background-color: #ffd6d6;
}

/* Main Content */
main {
  padding: 20px;
}

.welcome {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.systems-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.desktopBg {
  background: #0f4889;
}

.systems {
  flex: 1;
  min-width: 300px;
  max-width: 800px;
}

.system-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.3s, transform 0.2s;
  margin-bottom: 10px;
}

.system-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.system-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-right: 15px;
}

.system-info {
  flex: 1;
}

.desktop-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e6b800;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 15px;
  text-decoration: none;
  color: black;
  transition: box-shadow 0.3s, transform 0.2s;
  margin-bottom: 10px;
}

.desktop-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.viewIcon {
  font-size: 1.5rem;
  color: #c00000;
  margin-left: 10px;
}
</style>
