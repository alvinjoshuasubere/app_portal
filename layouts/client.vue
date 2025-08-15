<template>
  <!-- HEADER NAVIGATION BAR-->

  <div class="topBarNav">
    <h5 class="ml-4" style="font-weight: bolder; font-family: font_B">
      <b-img style="width: 50px; height: auto" src="/ict_logo.png"></b-img>
      ICT Online Ticketing System
    </h5>
    <div class="topRightBarContainer">
      <div class="topRightBar">
        <b-badge
          variant="danger"
          :class="notifCounter > 0 ? 'notiCounter' : 'invisNotiCounter ml-1'"
          ><b :class="notifCounter >= 10 ? 'lotsOfNoti' : ''">{{
            notifCounter >= 10 ? "9+" : notifCounter
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
                    <b class="noti__name mt-2">
                      {{
                        notif.name_of_requestor
                          ? notif.name_of_requestor
                          : notif.department
                      }}</b
                    >
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
            <b-dropdown-item @click="openPDF('User')">User</b-dropdown-item>
          </b-dropdown>
        </div>
        <span class="userBtn">
          <!-- <i class="fas fa-user userIcon"></i> -->
          <b-img class="userIcon" src="/icon.png"></b-img>
        </span>
        <span
          class="mb-1"
          style="position: relative; padding-left: 1.5rem; padding-right: 2rem"
        >
          <b-row>
            <b style="font-size: 10px; font-size: 12px; color: #343a40"
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
            @click="showModalLogout = true"
            v-b-modal.modal-logout
          >
            <i class="fas fa-power-off loIcon"></i>
          </b-button>
          <b-modal
            id="modal-logout"
            v-model="showModalLogout"
            header-class="otsColor"
            header-text-variant="light"
            hide-header-close
            title="Do you really wish to logout?"
          >
            <p style="font-size: 15px" class="text-center">
              Any pending changes will not be saved... <br />
              Press Logout to confirm or press cancel.
            </p>
            <template #modal-footer>
              <div class="w-100">
                <b-button
                  variant="secondary"
                  size="sm"
                  class="float-right greyBtn"
                  @click="showModalLogout = false"
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

    <div class="customerCont">
      <nuxt />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";

export default {
  middleware: "customerValidator",
  async created() {
    await this.connectToServer();
  },
  data() {
    return {
      disp: false,
      showModalLogout: false,
      myInterval: null,
      role: "CLIENT",
      user: localStorage.department_name,
      modules: [],
      activeadminsubmenus: [],
      activelinks: [],
      clickStatus: false,
      intervalId: null,

      loggedByOthers: false,
      socket: null,
      checkTokenInterval: null,

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
      console.log(data.request_id, "REQEUST");
      try {
        if (data.is_read == false) {
          const id = localStorage.id;

          this.socket.emit("notif read", {
            id: data.id,
            user_id: id,
          });
        }
        if (this.$route.path === "/tracking") {
          await this.$root.$emit("selectNotiRow", data.request_id);
        }
        await this.$refs.ndropdown.hide(true);
      } catch (e) {
        console.log("Error from client.vue notifClicked", e);
      }
    },
    formatDate(date) {
      return moment(date).tz("UTC").format("MMMM DD, YYYY");
    },
    formatTime(date) {
      const now = moment().tz("UTC");
      const givenTime = moment(date).tz("UTC");

      const diffMinutes = now.diff(givenTime, "minutes");
      const diffHours = now.diff(givenTime, "hours");
      const diffDays = now.diff(givenTime, "days");
      const diffMonths = now.diff(givenTime, "months");
      const diffYears = now.diff(givenTime, "years");

      if (diffYears >= 1) {
        return `${diffYears}yr ago`;
      } else if (diffMonths >= 1) {
        return `${diffMonths}m ago`;
      } else if (diffDays >= 1) {
        return `${diffDays}d ago`;
      } else if (diffHours >= 1) {
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

        const id = localStorage.client_id;

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
              name_of_requestor: e.name_of_requestor,
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
              name_of_requestor: e.name_of_requestor,
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
      window.open("/User.pdf");
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
.content {
  padding-top: 56px; /* Adjust based on your navbar height */
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

.notiButton {
  .btn:focus {
    box-shadow: none;
  }
}

.dropdown-menu {
  border: none;
}
</style>
