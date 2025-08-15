<template>
  <div class="wrapper">
    <!-- LOGGED ON OTHER BROWSERS -->
    <!-- <div class="freeze" v-show="loggedByOthersSameBrowser">
      <div class="freezeHold">
        <div class="freezeContent">
          <div class="freezeHeader">
            <font-awesome-icon icon="triangle-exclamation" class="icon" />
            &ensp; Multiple Login on same browser
          </div>
          <div class="freezeBody">
            Your account has been logged to another browser.
            <br />
            <br />
            Online Ticketing System user accounts are only allowed to login one
            browser at a time, thank you.
          </div>
          <div class="freezeFooter">
            <button @click="logout()">Got it!</button>
          </div>
        </div>
      </div>
    </div> -->
    <!-- LOGGED ON OTHER BROWSERS -->
    <div class="freeze" v-show="loggedByOthers">
      <div class="freezeHold">
        <div class="freezeContent">
          <div class="freezeHeader">
            <font-awesome-icon icon="triangle-exclamation" class="icon" />
            &ensp; Multiple Login
          </div>
          <div class="freezeBody">
            Your account has been logged to another browser.
            <br />
            <br />
            Online Ticketing System user accounts are only allowed to login one
            browser at a time, thank you.
          </div>
          <div class="freezeFooter">
            <button @click="logout()">Got it!</button>
          </div>
        </div>
      </div>
    </div>
    <nav id="sidebar">
      <div class="sidebar-header">
        <div>
          <b-img
            src="/system_logo.png"
            class="bfiImage"
            style="width: 100%; height: 100%"
            center
          ></b-img>
          <b-img
            src="/city_logo.png"
            class="cityIcon"
            style="width: 100%; height: 100%; display: none"
            center
          ></b-img>
        </div>
        <hr class="hr" />

        <ul class="list-unstyled">
          <li v-for="(link, index) in filteredLinks" :key="index">
            <router-link class="my-1" :id="'sb1-' + index" :to="link.path">
              <b-row>
                <b-col cols="2">
                  <span>
                    <font-awesome-icon :icon="link.icon" class="icon" />
                  </span>
                </b-col>
                <b-col>
                  <span class="ml-2 sidebarText">{{ link.description }}</span>
                </b-col>
              </b-row>
            </router-link>
          </li>
        </ul>
      </div>
      <footer class="footerStyle">Copyright &copy; 2024 Koronadal City</footer>
    </nav>

    <!-- HEADER NAVIGATION BAR-->
    <div class="topRightBarContainer">
      <div class="pendingCont">
        <div class="pendingDisplay">
          <div name="fade" class="pendingText1">
            <b>&nbsp;You have</b>
          </div>
          <div v-if="requestCounter > 0" class="pendingNum">
            {{ requestCounter }}
          </div>
          <div v-else class="pendingNum">0</div>
          <div v-if="requestCounter == 0" class="pendingText">
            <b>&nbsp;unresolved request.</b>
          </div>
          <div v-else class="pendingText">
            <b>&nbsp;unresolved requests!</b>
          </div>
        </div>
      </div>
      <div class="topRightBar">
        <b-badge
          variant="danger"
          :class="notifCounter > 0 ? 'notiCounter' : 'invisNotiCounter ml-1'"
          ><b :class="notifCounter >= 100 ? 'lotsOfNoti' : ''">{{
            notifCounter >= 100 ? "99+" : notifCounter
          }}</b></b-badge
        >
        <span class="xspacer notiContainer">
          <b-dropdown
            class="notiBellDropdown"
            size="lg"
            variant="link"
            toggle-class="text-decoration-none"
            no-caret
            right
            ref="ndropdown"
            v-b-tooltip.hover
            title="Notifications"
          >
            <template v-slot:button-content>
              <font-awesome-icon
                title="Notifications"
                class="notiIcon"
                icon="bell"
              />
            </template>

            <span class="noti__title">
              <b>Notifications</b>
              <span @click="markAllAsRead">Mark all as read</span>
            </span>

            <ul class="noti-body mt-2">
              <li v-if="notifs.length == 0" class="noti-text-read">
                You have no notifications this day.
              </li>

              <li
                v-for="(notif, index) in notifs"
                :key="index"
                :class="notif.is_read ? 'noti-text-read' : 'noti-text'"
                @click="notifClicked(notif)"
              >
                <div class="noti__header">
                  <div class="noti__left">
                    <b class="noti-time">
                      {{ formatTime(notif.date_created) }}
                      <small
                        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                          formatDate(notif.date_created)
                        }}</small
                      >
                    </b>
                    <b class="noti__name mt-2"> {{ notif.department }}</b>
                    <div class="noti__message mt-1">
                      <span>{{ notif.message }}</span>
                    </div>
                  </div>
                  <div class="noti__right">
                    <font-awesome-icon
                      :icon="notif.is_read ? 'envelope-open' : 'envelope'"
                      :class="notif.is_read ? 'noti-icon-read' : 'noti-icon'"
                    />
                  </div>
                </div>
              </li>
            </ul>
            <div class="noti-footer"></div>
          </b-dropdown>
        </span>

        <div class="userGuideBtnContainer">
          <b-dropdown
            no-caret
            variant="none"
            toggle-class="userGuideBtn"
            class="userguide-dropdown"
          >
            <template #button-content>
              <i class="fas fa-question userGuideIcon"></i>
            </template>
            <b-dropdown-header>User Guide</b-dropdown-header>
            <b-dropdown-item
              v-if="role == 'DISPATCH'"
              @click="openPDF('Dispatcher')"
              >Dispatcher</b-dropdown-item
            >
            <b-dropdown-item @click="openPDF('Technician')"
              >Technician</b-dropdown-item
            >
          </b-dropdown>
        </div>
        <!-- <div class="userGuideBtnContainer">
          <button
            v-b-tooltip.hover
            title="User Guide"
            @click="openPDF"
            class="userGuideBtn"
            variant="none"
          >
            <i class="fas fa-question userGuideIcon"></i>
          </button>
        </div> -->
        <span class="userBtn">
          <!-- <i class="fas fa-user userIcon"></i> -->
          <b-img class="userIcon" src="/icon.png"></b-img>
        </span>
        <span
          class="mb-1"
          style="position: relative; padding-left: 1.5rem; padding-right: 2rem"
        >
          <b-row>
            <b style="font-size: 10px; font-size: 12px; color: #051937"
              >{{ user }}&nbsp;</b
            >
          </b-row>
          <b-row>
            <b-badge
              style="
                margin-top: 1px;
                font-size: 9px;
                border-radius: 100px;
                padding: 3px 6px;
                background-color: #051937;
              "
              >{{ role }}</b-badge
            >
          </b-row>
        </span>

        <span
          id="btnLO"
          class="loBtnContainer"
          align="right"
          style="margin-top: 5px"
          v-b-tooltip.hover
          title="Sign-out"
        >
          <b-button
            id="btnLogout"
            pill
            class="customBtnLO"
            @click="show = true"
            v-b-modal.modal-logout
          >
            <i class="fas fa-power-off loIcon"></i>
          </b-button>
          <b-modal
            id="modal-logout"
            v-model="show"
            header-class="otsColor"
            header-text-variant="light"
            hide-header-close
            title="Do you really wish to logout?"
          >
            <p style="font-size: 15px" class="text-center">
              Any pending changes will not be saved... <br />
              Press Logout to confirm or press esc to cancel.
            </p>
            <template #modal-footer>
              <div class="w-100">
                <b-button
                  variant="secondary"
                  size="sm"
                  class="float-right greyBtn"
                  @click="show = false"
                >
                  Cancel
                </b-button>
                <b-button
                  variant="primary"
                  size="sm"
                  class="float-right purpleBtn mr-2"
                  @click="logout"
                >
                  Logout
                </b-button>
              </div>
            </template>
          </b-modal>
        </span>
      </div>
    </div>
    <div class="mainContainer">
      <nuxt />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
// import io from "socket.io-client";

export default {
  middleware: "pageValidator",
  async created() {
    await this.connectToServer();
    // let serverLink = `${process.env.socketIO}`;
    // localStorage.serverLink = serverLink;
    // // CONNECT TO SERVER ============================================================
    // const socket = io.connect(serverLink, {
    //   secure: true,
    // });
    // // RECEIVE TOKEN CHECKING
    // socket.on("verifyToken", (tokenCheck) => {
    //   if (tokenCheck == true) {
    //     this.loggedByOthers = true;
    //   }
    //   // console.log("=================================");
    //   setInterval(() => {
    //     // CHECK TOKEN ===================================================================
    //     this.checkToken();
    //     // this.checkTokenAPI();
    //   }, 10000);
    // });
  },
  data() {
    return {
      disp: false,
      show: false,
      myInterval: null,
      role: localStorage.role,
      user: localStorage.fullName,
      modules: [],
      activeadminsubmenus: [],
      activelinks: [],
      clickStatus: false,
      intervalId: null,

      loggedByOthers: false,
      socket: null,
      checkTokenInterval: null,

      links: [
        {
          path: "/dashboard",
          icon: "square-poll-vertical",
          description: "Dashboard",
          action: "view dashboard",
          roles: ["TECHNICIAN", "DISPATCH", "ADMIN"],
        },
        {
          path: "/request",
          icon: "chart-bar",
          description: "Request",
          action: "view request",
          roles: ["TECHNICIAN", "DISPATCH", "ADMIN"],
        },
        {
          path: "/dispatcher",
          icon: "clock",
          description: "Dispatcher",
          action: "view dispatcher",
          roles: ["DISPATCH", "ADMIN"],
        },
        {
          path: "/reports",
          icon: "chart-line",
          description: "Reports",
          action: "view reports",
          roles: ["TECHNICIAN", "DISPATCH", "ADMIN"],
        },
      ],

      notifCounter: 0,
      notifs: [],
      socket: null,
      requestCounter: 0,
    };
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    logout() {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      localStorage.clear();
      this.$router.push("/");
      return false;
    },
    async checkTokenAPI() {
      await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/user-account/check-token/${localStorage.token}`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => {
        const count = res.data;
        if (count === 0) {
          this.loggedByOthers = true;
        }
      });
    },
    async notifClicked(data) {
      try {
        if (data.is_read == false) {
          const id = localStorage.id;

          this.socket.emit("notif read", {
            id: data.id,
            user_id: id,
          });
        }
        if (localStorage.role == "DISPATCH") {
          if (this.$route.path === "/dispatcher") {
            await this.$root.$emit("selectNotiRow", data.request_id);
          } else if (this.$route.path === "/request") {
            await this.$root.$emit("selectNotiRow", data.request_id);
          }
        } else {
          if (this.$route.path === "/request") {
            await this.$root.$emit("selectNotiRow", data.request_id);
          }
        }
        await this.$root.$emit("selectNotiRow", data.request_id);
        await this.$refs.ndropdown.hide(true);
      } catch (e) {
        console.log("Error from sidebar.vue notifClicked", e);
      }
    },
    formatDate(date) {
      return moment(date).tz("UTC").format("MMMM DD, YYYY");
    },
    formatTime(date) {
      const now = moment().tz("UTC"); // Current time in UTC
      const givenTime = moment(date, "YYYY-MM-DD HH:mm:ss").tz("UTC"); // Input date in 24-hour format

      if (!givenTime.isValid()) {
        return "Invalid date";
      }

      // const diffSeconds = Math.max(now.diff(givenTime, "seconds"), 0);
      const diffMinutes = Math.abs(now.diff(givenTime, "minutes"));
      const diffHours = Math.abs(now.diff(givenTime, "hours"));
      const diffDays = now.diff(givenTime, "days");
      const diffMonths = now.diff(givenTime, "months");
      const diffYears = now.diff(givenTime, "years");

      if (diffYears >= 1) {
        return `${diffYears}yr ago`;
      } else if (diffMonths >= 1) {
        return `${diffMonths}m ago`;
      } else if (diffDays >= 1) {
        return `${diffDays}d ago`;
      } else if (diffMinutes >= 60) {
        return `${diffHours}h ago`;
      } else {
        return `${diffMinutes}m ago`;
      }
    },
    connectToServer() {
      this.notifs = [];
      try {
        if (!this.socket) {
          this.socket = io.connect(process.env.socketIO, { secure: true }); // Connect to server
        }

        const id = localStorage.id;

        // Receive new notifications
        this.socket.on(`new req - ${id}`, (data) => {
          this.requestCounter = data.unfinishedRequestsCount;
          let temp = [];
          let counter = 0;
          const notifs = data.notifs;

          let isNewData = false;

          for (let i = 0; i < notifs.length; i++) {
            const e = notifs[i];

            if (!e.is_read) {
              counter++;
            }

            temp.push({
              id: e.id,
              message: e.message,
              is_read: e.is_read,
              date_created: e.date_created,
              request_id: e.request_id,
              department: e.department,
              requestor: e.name_of_requestor,
              data: e,
            });

            // Check if this request_id is new
            if (!this.notifs.some((n) => n.id === e.id)) {
              isNewData = true;
            }
          }

          this.notifs = temp;
          this.notifCounter = counter;
          localStorage.setItem("notiCounter", this.notifCounter);

          // If new data is detected, trigger getRequest() via refreshRequestData event
          if (isNewData) {
            this.$root.$emit("refreshRequestData");
          }
        });

        // Retrieve current notifications
        this.socket.emit(`my notif`, { id });

        this.socket.on(`my req - ${id}`, (data) => {
          this.requestCounter = data.unfinishedRequestsCount;
          let temp = [];
          let counter = 0;
          const notifs = data.notifs;

          let isNewData = false;

          for (let i = 0; i < notifs.length; i++) {
            const e = notifs[i];

            if (!e.is_read) {
              counter++;
            }

            temp.push({
              id: e.id,
              message: e.message,
              is_read: e.is_read,
              date_created: e.date_created,
              request_id: e.request_id,
              department: e.department,
              requestor: e.name_of_requestor,
              data: e,
            });

            // Check if this request_id is new
            if (!this.notifs.some((n) => n.id === e.id)) {
              isNewData = true;
            }
          }

          this.notifs = temp;
          this.notifCounter = counter;
          localStorage.setItem("notiCounter", this.notifCounter);

          // If new data is detected, trigger getRequest() via refreshRequestData event
          if (isNewData) {
            this.$root.$emit("refreshRequestData");
          }
        });

        // Start the interval only if it hasn’t been started already
        if (!this.intervalId) {
          this.intervalId = setInterval(() => {
            this.checkTokenAPI();
            this.socket.emit(`my notif`, { id });
          }, 2000);
        }
      } catch (e) {
        console.log(e, "ERROR");
      }
    },
    openPDF(user) {
      if (user.toLowerCase().includes("dispatch")) {
        window.open("/Dispatcher.pdf");
      } else {
        window.open("/Technician.pdf");
      }
    },
    async markAllAsRead() {
      try {
        const id = localStorage.id;

        this.socket.emit("notif all read", {
          id,
        });

        this.$refs.ndropdown.hide(true);
      } catch (e) {
        console.log(e);
      }
    },
  },

  computed: {
    filteredLinks() {
      // Filter links based on the retrieved role
      return this.links.filter((link) => link.roles.includes(this.role));
    },
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style lang="scss" scoped>
a[data-toggle="collapse"] {
  position: relative;
  /* font-size: large; */
}

.dropdown-toggle::after {
  display: fixed;
  position: absolute;
  top: 50%;
  right: 10px;
  /* transform: translateY(-50%); */
}

body {
  font-family: "Poppins", sans-serif;
  background: #fafafa;
}

p {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 1.1em;
  line-height: 1.7em;
  color: rgb(60, 58, 58);
}

.primary {
  background-color: #024288;
}

.icon {
  margin-left: 13px;
  margin-right: 13px;
}

.hr {
  background-color: white;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
  border-radius: 3px;
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: black;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.notiButton {
  .btn:focus {
    box-shadow: none;
  }
}

.dropdown-menu {
  border: none;
}
</style>
