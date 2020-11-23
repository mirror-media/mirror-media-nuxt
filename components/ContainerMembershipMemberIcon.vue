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
        <nuxt-link class="dropdown-menu__profile-link" to="/profile">
          個人資料
        </nuxt-link>
        <button
          class="dropdown-menu__sign-out-button sign-out-button"
          @click="handleSignOutButtonClick"
        >
          登出
        </button>
      </div>
    </div>
    <nuxt-link v-else to="/login" class="not-logged-in-link">登入</nuxt-link>
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
  &__profile-link {
    width: 100%;
    padding: 24px 0;
    text-align: center;
  }
  &__sign-out-button {
    width: 100%;
    padding: 10px 0;
    border-top: 1px solid #d8d8d8;
  }
}
</style>
