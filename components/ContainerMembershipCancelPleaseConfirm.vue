<template>
  <div class="wrapper">
    <h1 class="wrapper__title title">你確定要刪除會員嗎？</h1>
    <div class="wrapper__description description">
      <p class="description__paragraph">
        <span>你的會員帳號為：</span>
        <span class="current-member-email" v-text="currentMemberEmail" />
      </p>
      <p class="description__paragraph">
        <span>刪除後即無法復原，</span>
        <span>將無法享有鏡週刊會員獨享服務</span>
      </p>
    </div>
    <div class="wrapper__button-wrapper button-wrapper">
      <button class="router-back-button" @click="handleRouterBackClick">
        不刪除，回前頁
      </button>

      <button
        class="confirm-cancel-button"
        @click="handleConfirmCancelButtonClick"
      >
        <UiMembershipLoadingIcon v-if="isLoading" :isDark="true" />
        <span v-else>確認刪除</span>
      </button>
    </div>
  </div>
</template>

<script>
import UiMembershipLoadingIcon from '~/components/UiMembershipLoadingIcon.vue'
import userDelete from '~/apollo/mutations/userDelete.gql'
export default {
  components: {
    UiMembershipLoadingIcon,
  },
  apollo: {
    $client: 'memberSubscription',
  },

  data() {
    return {
      isLoading: false,
    }
  },

  computed: {
    currentMemberEmail() {
      return this.$store.state.membership.userEmail
    },
  },
  methods: {
    handleRouterBackClick() {
      this.$router.back()
    },
    async handleConfirmCancelButtonClick() {
      if (this.isLoading) return
      try {
        this.isLoading = true
        const memberId = this.$store.state['membership-subscribe']?.basicInfo.id
        const response = await this.$apollo.mutate({
          mutation: userDelete,
          variables: {
            id: memberId,
          },
        })

        // delete firebase auth
        const currentUser = this.$fire.auth.currentUser
        currentUser?.delete()

        // clear the firebase current user state in the store
        this.$store.commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
          authUser: {},
        })
        if (response.error) {
          this.handleConfirmCancelError(response.error)
          return
        }

        this.isLoading = false
        this.$emit('success')
      } catch (err) {
        this.handleConfirmCancelError(err)
      }
    },
    handleConfirmCancelError(err) {
      // eslint-disable-next-line no-console
      console.error(err)
      this.isLoading = false
      this.$emit('error', err)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 40px 20px;
  &__description,
  &__button-wrapper {
    margin: 40px 0 0 0;
  }
}

.title {
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
  color: #d0021b;
  text-align: center;
  @include media-breakpoint-up(xl) {
    font-size: 32px;
  }
}

.description {
  font-size: 18px;
  line-height: 32px;
  color: #4a4a4a;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__paragraph {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include media-breakpoint-up(xl) {
      flex-direction: row;
      justify-content: center;
    }
  }
}
.current-member-email {
  word-break: break-all;
  text-align: center;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  button + button {
    margin: 20px 0 0 0;
  }
  button:focus {
    outline: 0;
  }
}
.router-back-button {
  width: 100%;
  max-width: 240px;
  height: 60px;
  background-color: #204f74;
  color: white;
  font-size: 20px;
}
.confirm-cancel-button {
  width: 100%;
  max-width: 240px;
  height: 60px;
  background-color: white;
  color: #d0021b;
  border: 1px solid #d0021b;
  font-size: 20px;
}
</style>
