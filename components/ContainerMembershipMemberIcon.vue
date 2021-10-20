<template>
  <div class="icon-wrapper">
    <div v-if="isLoggedIn" class="logged-in-wrapper">
      <div
        v-click-outside="hideDropdownMenu"
        class="logged-in-icon"
        @click="handleMemberIconClick"
      >
        <SvgMembershipMemberIconLoggedIn class="logged-in-icon__icon" />
      </div>
      <div
        v-show="shouldShowDropdownMenu"
        class="logged-in-wrapper__dropdown-menu dropdown-menu"
      >
        <a href="/profile" class="dropdown-menu__list">個人資料</a>
        <a href="/profile/purchase" class="dropdown-menu__list">訂閱紀錄</a>
        <button
          class="dropdown-menu__sign-out-button sign-out-button"
          @click="handleSignOutButtonClick"
        >
          登出
        </button>
      </div>
    </div>
    <a
      v-else
      :href="`/login?destination=${$route.path}`"
      class="not-logged-in-link"
    >
      登入
    </a>
  </div>
</template>

<script>
import SvgMembershipMemberIconLoggedIn from '~/assets/membership-member-icon-logged-in.svg?inline'
export default {
  components: {
    SvgMembershipMemberIconLoggedIn,
  },
  data() {
    return {
      shouldShowDropdownMenu: false,
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['membership/isLoggedIn']
    },
  },
  methods: {
    async handleSignOutButtonClick() {
      await this.$fire.auth.signOut()

      // clear the firebase current user state in the store
      this.$store.commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
        authUser: {},
      })

      window.location.reload()
    },
    handleMemberIconClick() {
      this.shouldShowDropdownMenu = !this.shouldShowDropdownMenu
    },
    hideDropdownMenu() {
      this.shouldShowDropdownMenu = false
    },
  },
}
</script>

<style lang="scss" scoped>
.logged-in-wrapper {
  position: relative;
  &__dropdown-menu {
    position: absolute;
    left: -40px;
  }
}

.logged-in-icon {
  cursor: pointer;
  width: 100%;
  height: 100%;
  &__icon {
    width: 100%;
    height: 100%;
  }
}

.not-logged-in-link {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #888888;
}

.dropdown-menu {
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  z-index: 99999;
  font-size: 13px;
  color: #888888;
  &__list {
    width: 100%;
    padding: 24px 0;
    text-align: center;
    border-bottom: 1px solid #d8d8d8;
  }
  &__sign-out-button {
    width: 100%;
    padding: 24px 0;
  }
}
</style>
