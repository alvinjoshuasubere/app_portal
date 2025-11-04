<template>
  <body>
    <!-- HEADER -->
    <div class="page-container">
      <header class="portal-header">
        <div class="logo-container">
          <img src="city_logo.png" alt="Portal Logo" class="logo" />

          <div class="site-info">
            <h1>KORONADAL CITY PORTAL</h1>
            <p>Your gateway to city digital online services</p>
          </div>
          <img src="ict_logo.png" alt="ICT Logo" class="ict-logo" />
        </div>
      </header>

      <main>
        <!-- <section class="welcome mb-3">
          <h2 class="titleHeaderName">ICTD System Portal</h2>
          <p>
            Here you can access the links of all the system that are being used
            by the City Government of Koronadal.
          </p>
        </section>
        <hr /> -->
        <section class="systems-container">
          <div class="systems">
            <h6 class="text-left titleName mb-4">
              Web based Applications <br />
              <small style="font-size: 0.8rem; color: #555"
                >is a program you access through a web browser. You don’t need
                to install anything — you just visit a URL.
              </small>
            </h6>
            <a
              v-for="(system, index) in systems"
              :key="index"
              :href="system.isOnline ? system.link : null"
              target="_blank"
              rel="noopener"
              class="system-card"
              :class="{ offline: !system.isOnline }"
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
            <h6 class="text-left titleName mb-4">
              Desktop Applications <br />
              <small style="font-size: 0.8rem; color: #555">
                is a program installed directly on a computer and runs without
                using a browser.
              </small>
            </h6>

            <a
              v-for="(system, index) in desktop"
              :key="index"
              class="desktop-card"
            >
              <img :src="system.logo" :alt="system.name" class="system-logo" />
              <div class="system-info">
                <h3 class="appName">{{ system.name }}</h3>
                <p class="subName text-left">{{ system.description }}</p>
              </div>
            </a>
          </div>
        </section>
      </main>
      <footer class="portal-footer">
        <p>&copy; 2025 Information Communications and Technology Division.</p>
      </footer>
    </div>
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
          isOnline: false,
        },
        {
          name: "Real-Time DTR Tracking System",
          description: "Track daily time records in real-time.",
          logo: "city_logo.png",
          link: "http://192.168.0.108:4000/",
          isOnline: false,
        },
        {
          name: "Motorized Tricycle Operators Permit System",
          description: "Electronic management of tricycle operators' permits.",
          logo: "mtops.png",
          link: "http://192.168.0.108:5000/",
          isOnline: false,
        },
        {
          name: "Human Resource Management System",
          description: "View payroll, attendance, and salary records.",
          logo: "hrms.png",
          link: "http://192.168.0.5:60/",
          isOnline: false,
        },
        {
          name: "Budget Management System",
          description: "Manage budget proposals and allocations.",
          logo: "bos.png",
          link: "http://192.168.0.5:61/",
          isOnline: false,
        },
        {
          name: "Supply Management System",
          description: "Monitor supply requests and create purchase orders.",
          logo: "sms.png",
          link: "http://192.168.0.140:63/",
          isOnline: false,
        },
      ],
      desktop: [
        {
          name: "Property Assessment and Tax Administration System",
          description:
            "Application for the inventory, valuation, assessment, collection and reporting of property taxes.",
          logo: "patas.png",
        },
        {
          name: "Business Permit and Licensing System",
          description: "Business registration and licensing management.",
          logo: "bpls.png",
        },
        {
          name: "Project Monitoring System",
          description: "Manage Program and Project Monitoring.",
          logo: "pms.png",
        },
        {
          name: "Document Tracking System",
          description:
            "System that enables real-time monitoring of document flow, location and status.",
          logo: "dtrax.png",
        },
        {
          name: "BRGY. Treasury Operations System",
          description: "Remittance and collection management of barangays.",
          logo: "BTOS.png",
        },
        {
          name: "CEEDO Treasury Operations System",
          description: "Collection and remittance management for CEEDO.",
          logo: "TOS.png",
        },
        {
          name: "Treasury Operations System",
          description: "Collection and remittance management of the City.",
          logo: "TOS.png",
        },
        {
          name: "Building Permit Application System",
          description: "Building permit assessment and management.",
          logo: "bpas.png",
        },
      ],
    };
  },
  beforeCreate() {},
  mounted() {
    this.checkSystemsStatus();
    setInterval(this.checkSystemsStatus, 10000);
  },
  created() {},
  computed: {},
  methods: {
    openSystem(url) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            console.log("✅ System launched successfully!");
          } else {
            console.warn("⚠️ Unexpected response:", data);
            alert("⚠️ Failed to launch system.");
          }
        })
        .catch((err) => {
          console.error("❌ Cannot connect to helper service:", err);
          alert("⚠️ Helper service not running. Please start it first.");
        });
    },
    async checkSystemsStatus() {
      for (let system of this.systems) {
        try {
          await fetch(system.link, { method: "GET", mode: "no-cors" });
          system.isOnline = true;
        } catch (e) {
          system.isOnline = false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
/* Reset & Basics */
html,
body {
  height: 100%;
  margin: 0;
  background: #f5f7fa;
  background-image: radial-gradient(
    circle at 1px 1px,
    #dcdcdc 1px,
    transparent 0
  );
  background-size: 20px 20px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
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
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}

.portal-header {
  background-color: #8b0000;
  color: white;
  border-bottom: 1px solid #ddd;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
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
  height: auto;
  border-radius: 8px;
}

.site-info h1 {
  font-size: 1.5rem;
  font-family: font_B;
}

.site-info p {
  font-size: 0.9rem;
  opacity: 0.9;
}

main {
  padding: 20px;
  padding-bottom: 80px;
  box-sizing: border-box;
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
  border: #ddd;
  border-radius: 12px;
  padding: 16px 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.system-card:hover {
  background-color: #f5f7fa;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
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
  background: linear-gradient(135deg, #fffde7, #fff59d, #fdd835);
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.desktop-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, #fff59d, #fdd835, #fbc02d);
}

.viewIcon {
  font-size: 1.4rem;
  -webkit-text-fill-color: transparent;
  margin-left: 10px;
  transition: transform 0.2s ease, opacity 0.3s ease;
}

.viewIcon:hover {
  transform: scale(1.2);
  opacity: 0.85;
}
.portal-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 10px;
  background-color: #f4f4f4;
  font-size: 0.8rem;
  color: #555;
  border-top: 1px solid #ddd;
  z-index: 1000;
}
.system-card.offline {
  pointer-events: none;
  opacity: 0.4;
  filter: grayscale(100%);
  cursor: not-allowed;
  position: relative;
}

.system-card.offline {
  position: relative;
  pointer-events: none;
  opacity: 0.5;
  filter: grayscale(100%);
  cursor: not-allowed;
}

.system-card.offline::before {
  content: "";
  position: absolute;
  top: 20px;
  right: 8px;
  width: 100px;
  height: 45px;
  background-image: url("../../static/warning.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1;
  z-index: 999;
}
</style>
