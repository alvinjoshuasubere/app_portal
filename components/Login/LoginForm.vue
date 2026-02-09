<template>
  <body>
    <!-- HEADER -->
    <div class="page-container">
      <Loading v-if="loading" style="z-index: 9999" />
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
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner">
            <font-awesome-icon icon="spinner" spin />
            <p>Loading portal data...</p>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-message">
            <font-awesome-icon icon="exclamation-triangle" />
            <p>{{ error }}</p>
            <button @click="loadPortalData" class="retry-btn">Retry</button>
          </div>
        </div>
        
        <!-- Main Content -->
        <div v-else>
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-container">
            <div class="hero-content">
              <h1>Welcome to Koronadal City Digital Portal</h1>
              <p>Your comprehensive gateway to all city government services and information</p>
              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ systems.length }}</span>
                  <span class="stat-label">Local Services</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ desktop.length }}</span>
                  <span class="stat-label">Desktop Apps</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">24/7</span>
                  <span class="stat-label">Availability</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        

        <!-- Systems Container -->
        <section class="systems-container">
          <div class="systems">
            <h6 class="text-left titleName mb-4">
              Web based Applications <br />
              <small style="font-size: 0.8rem; color: #555"
                >is a program you access through a web browser. You don't need
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

        <!-- Quick Services Section -->
        <section class="quick-services">
          <div class="services-container">
            <h2>Quick Services Online</h2>
            <div class="services-grid">
              <div v-for="(service, index) in quickServices" :key="index" class="service-card" @click="openService(service)">
                <div class="service-icon">
                  <font-awesome-icon :icon="service.icon" />
                </div>
                <h3>{{ service.name }}</h3>
                <p>{{ service.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- News and Announcements Section -->
        <section class="news-section">
          <div class="news-container">
            <div class="news-header">
              <h2>Latest News & Announcements</h2>
              <!-- <button class="view-all-btn" @click="viewAllNews">View All</button> -->
            </div>
            <div class="news-grid">
              <article v-for="(news, index) in latestNews" :key="index" class="news-card" @click="openNews(news)">
                <div class="news-image">
                  <img :src="news.image" :alt="news.title" />
                  <span class="news-category">{{ news.category }}</span>
                </div>
                <div class="news-content">
                  <h3>{{ news.title }}</h3>
                  <p class="news-excerpt">{{ news.excerpt }}</p>
                  <div class="news-meta">
                    <span class="news-date">{{ formatDate(news.date) }}</span>
                    <span class="news-author">{{ news.author }}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        </div>
      </main>
      <footer class="portal-footer">
        <p>&copy; 2025 Information Communications and Technology Division.</p>
      </footer>
    </div>
  </body>
</template>


<script>
import Loading from "@/components/LoadingOverlay/Loadings";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      latestNews: [],
      quickServices: [],
      systems: [],
      desktop: [],
      loading: false,
      error: null
    };
  },
  beforeCreate() {},
  mounted() {
    this.loadPortalData();
    this.checkSystemsStatus();
    setInterval(this.checkSystemsStatus, 5000);
  },
  created() {},
  computed: {},
  methods: {
    async loadPortalData() {
      try {
        this.loading = true;
        
        const response = await fetch('/portal-data.json');
        const data = await response.json();
        
        this.systems = data.systems || [];
        this.desktop = data.desktop || [];
        this.quickServices = data.quickServices || [];
        this.latestNews = data.latestNews || [];
        
        // Convert date strings to Date objects for news
        this.latestNews = this.latestNews.map(news => ({
          ...news,
          date: new Date(news.date)
        }));
        
        this.loading = false;
      } catch (error) {
        console.error('Failed to load portal data:', error);
        this.error = 'Failed to load portal data';
        this.loading = false;
      }
    },
    formatDate(date) {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },
    openNews(news) {
      console.log('Opening news:', news.title);
      // Navigate to news detail or open link
      if (news.link && news.link !== '#') {
        window.open(news.link, '_blank');
      }
    },
    viewAllNews() {
      console.log('Viewing all news');
      // Navigate to news archive page
    },
    openService(service) {
      console.log('Opening service:', service.name);
      // Navigate to service page or open link
      if (service.link && service.link !== '#') {
        window.open(service.link, '_blank');
      }
    },
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
  background-color: #1e3a8b;
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

.desktop-card {
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

.desktop-card:hover {
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

.system-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  background-size: 200% 100%;
  background-position: 0% 0%;

  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  text-decoration: none;

  color: black;
  font-weight: 500;

  transition: all 0.2s ease;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.system-card:hover {
  transform: translateY(-4px);
  background-position: 100% 0%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  color: #1e3a8b;
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

/* Hero Section Styles */
.hero-section {
  background: linear-gradient(135deg, #1e3a8b 0%, #3730a3 50%, #4f46e5 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-content p {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.95;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #fbbf24;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* News Section Styles */
.news-section {
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.news-container {
  max-width: 1200px;
  margin: 0 auto;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.news-header h2 {
  font-size: 2rem;
  color: #1e3a8b;
  margin: 0;
}

.view-all-btn {
  background: #1e3a8b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.view-all-btn:hover {
  background: #2563eb;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.news-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-category {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(30, 58, 139, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.news-content {
  padding: 20px;
}

.news-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #1e3a8b;
  line-height: 1.4;
}

.news-excerpt {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 15px 0;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Quick Services Section */
.quick-services {
  padding: 40px 20px;
  background: white;
}

.services-container {
  max-width: 1200px;
  margin: 0 auto;
}

.services-container h2 {
  text-align: center;
  font-size: 2rem;
  color: #1e3a8b;
  margin-bottom: 30px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.service-card {
  text-align: center;
  padding: 30px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid transparent;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  border-color: #1e3a8b;
}

.service-icon {
  font-size: 2.5rem;
  color: #1e3a8b;
  margin-bottom: 15px;
}

.service-card h3 {
  margin: 0 0 10px 0;
  color: #1e3a8b;
  font-size: 1.1rem;
}

.service-card p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .hero-stats {
    gap: 30px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .news-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .services-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .systems-container {
    flex-direction: column;
  }
  
  .systems {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 15px;
  }
  
  .hero-content h1 {
    font-size: 1.5rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .hero-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .logo-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .logo, .ict-logo {
    width: 50px;
    height: 50px;
  }
  
  .site-info h1 {
    font-size: 1.2rem;
  }
  
  .site-info p {
    font-size: 0.8rem;
  }
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

/* Loading and Error States */
.loading-container, .error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.loading-spinner, .error-message {
  text-align: center;
  color: #1e3a8b;
}

.loading-spinner svg, .error-message svg {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #1e3a8b;
}

.loading-spinner p, .error-message p {
  font-size: 1.2rem;
  margin: 10px 0;
}

.retry-btn {
  background: #1e3a8b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 15px;
  transition: background 0.3s ease;
}

.retry-btn:hover {
  background: #2563eb;
}

.error-message svg {
  color: #dc2626;
}
</style>
