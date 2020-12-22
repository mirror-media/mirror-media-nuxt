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
        確認刪除
      </button>
    </div>
  </div>
</template>

<script>
import userDelete from '~/apollo/mutations/userDelete.gql'

export default {
  apollo: {
    $client: 'userClient',
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
      try {
        const response = await this.$apollo.mutate({
          mutation: userDelete,
          variables: {
            id: this.$store.state.membership.userUid,
          },
        })

        await this.$fire.auth.signOut()

        // clear the firebase current user state in the store
        this.$store.commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
          authUser: {},
        })

        if (response.error) {
          handleError(response.error)
          return
        }

        this.$emit('success')
      } catch (e) {
        handleError(e)
      }

      function handleError(e) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.$emit('error')
      }
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
