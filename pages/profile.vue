<template>
  <section class="page">
    <div class="wrapper">
      <h1 class="title">個人資料</h1>
      <form class="wrapper__form form" novalidate @submit.prevent>
        <div class="form__item-wrapper email-wrapper">
          <h2 class="email-wrapper__subtitle subtitle">Email</h2>
          <p
            class="email-wrapper__current-member-email current-member-email"
            v-text="currentMemberEmail"
          />
        </div>
        <div class="form__item-wrapper name-wrapper">
          <label
            class="name-wrapper__subtitle subtitle"
            for="profile-name-input"
          >
            姓名
          </label>
          <input
            id="profile-name-input"
            type="text"
            class="input"
            placeholder="請輸入姓名"
          />
        </div>
        <div class="form__item-wrapper gender-wrapper">
          <label
            class="gender-wrapper__subtitle subtitle"
            for="profile-gender-dropdown"
          >
            性別
          </label>
          <UiMembershipDropdownMenu
            id="profile-gender-dropdown"
            :options="['男', '女', '不透露']"
            style="width: 90px"
          />
        </div>
        <div class="form__item-wrapper birthday-wrapper">
          <h2 class="subtitle">生日</h2>
          <div id="profile-birthday-form" class="birthday-form">
            <input
              type="number"
              class="input birthday-form__input-birthday-year input-birthday-year"
              placeholder="西元年"
            />
            <UiMembershipDropdownMenu
              class="birthday-form__dropdown-menu-birthday-month"
              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
              :height="50"
              style="width: 104px"
              :placeholder="'月份'"
            />
            <input
              type="number"
              class="input birthday-form__input-birthday-day input-birthday-day"
              placeholder="日期"
            />
          </div>
        </div>
        <div class="form__item-wrapper phone-wrapper">
          <label class="subtitle" for="profile-phone-input">電話</label>
          <input
            id="profile-phone-input"
            type="tel"
            class="input"
            placeholder="請輸入電話"
          />
        </div>
        <div class="form__item-wrapper address-wrapper">
          <h2 class="subtitle">地址</h2>
          <div
            class="address-wrapper__address-dropdown-menus address-dropdown-menus"
          >
            <label
              class="address-dropdown-menus__address-dropdown-menus-item address-dropdown-menus-item"
            >
              <span class="address-dropdown-menus-item__label">國家</span>
              <UiMembershipDropdownMenu
                class="address-dropdown-menus-item__dropdown-menu"
                :options="countriesOptions"
                style="width: 100%"
              />
            </label>
            <label
              class="address-dropdown-menus__address-dropdown-menus-item address-dropdown-menus-item"
            >
              <span class="address-dropdown-menus-item__label">縣市</span>
              <UiMembershipDropdownMenu
                class="address-dropdown-menus-item__dropdown-menu"
                :options="[]"
                style="width: 100%"
              />
            </label>
            <label
              class="address-dropdown-menus__address-dropdown-menus-item address-dropdown-menus-item"
            >
              <span class="address-dropdown-menus-item__label">行政區</span>
              <UiMembershipDropdownMenu
                class="address-dropdown-menus-item__dropdown-menu"
                :options="[]"
                style="width: 100%"
              />
            </label>
          </div>
          <input
            class="input address-wrapper__address-input"
            type="text"
            placeholder="請輸入地址"
          />
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import UiMembershipDropdownMenu from '~/components/UiMembershipDropdownMenu.vue'
import countriesData from '~/constants/countries.json'

export default {
  components: {
    UiMembershipDropdownMenu,
  },
  computed: {
    currentMemberEmail() {
      return this.$store.state.membership.user.email
    },
    countriesOptions() {
      return countriesData.map(function getTraditionalName(country) {
        return country.Taiwan
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 40px;
}

.wrapper {
  &__form {
    margin: 30px 0 0 0;
  }
}

.title,
.subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #4a4a4a;
}
.subtitle {
  margin: 0 0 12px 0;
}

.form {
  &__item-wrapper {
    display: flex;
    flex-direction: column;
    & + & {
      margin: 30px 0 0 0;
    }
  }
}
.input {
  height: 50px;
  background-color: #f2f2f2;
  padding: 15px 20px;
  font-size: 16px;
  color: #4a4a4a;
}
.input-birthday-year {
  width: 133px;
}
.input-birthday-day {
  width: 80px;
}

.birthday-form {
  &__input-birthday-day {
    margin: 20px 0 0 0;
  }
  &__dropdown-menu-birthday-month {
    margin: 20px 0 0 0;
  }
}

.address-wrapper {
  &__address-input {
    margin: 12px 0 0 0;
  }
}
.address-dropdown-menus {
  display: flex;
  flex-direction: column;
  &__address-dropdown-menus-item {
    & + & {
      margin: 12px 0 0 0;
    }
  }
}
.address-dropdown-menus-item {
  display: flex;
  align-items: center;
  &__label {
    display: inline-block;
    min-width: 50px;
    color: #4a4a4a;
  }
  &__dropdown-menu {
    margin: 0 0 0 12px;
  }
}
</style>
