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
              v-model.number="$v.birthdayYear.$model"
              type="number"
              :class="[
                'input',
                { 'input--invalid': isBirthdayYearInvalid },
                'birthday-form__input-birthday-year',
                'input-birthday-year',
              ]"
              placeholder="西元年"
              min="1911"
              @change="handleInputBirthdayYearChange"
            />
            <UiMembershipDropdownMenu
              class="birthday-form__dropdown-menu-birthday-month"
              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
              :height="50"
              style="width: 104px"
              :state="isBirthdayMonthInvalid ? 'invalid' : 'normal'"
              :placeholder="'月份'"
              @change="handleDropdownMenuBirthdayMonthChange"
            />
            <input
              v-model.number="$v.birthdayDay.$model"
              type="number"
              :class="[
                'input',
                { 'input--invalid': isBirthdayDayInvalid },
                'birthday-form__input-birthday-day',
                'input-birthday-day',
              ]"
              placeholder="日期"
              min="1"
              max="31"
              @change="handleInputBirthdayDayChange"
            />
          </div>
          <p v-show="shouldShowBirthdayInvalidHint" class="invalid-hint">
            請填寫完整出生年月日
          </p>
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
                :state="isAddressCountryInvalid ? 'invalid' : 'normal'"
                style="width: 100%"
                @change="handleDropdownMenuCountryChange"
              />
            </label>
            <label
              class="address-dropdown-menus__address-dropdown-menus-item address-dropdown-menus-item"
            >
              <span class="address-dropdown-menus-item__label">縣市</span>
              <UiMembershipDropdownMenu
                :key="currentCountryCode"
                class="address-dropdown-menus-item__dropdown-menu"
                style="width: 100%"
                :options="twCountiesOptions"
                :state="dropdownMenuStateCounty"
                @change="handleDropdownMenuCountyChange"
              />
            </label>
            <label
              class="address-dropdown-menus__address-dropdown-menus-item address-dropdown-menus-item"
            >
              <span class="address-dropdown-menus-item__label">行政區</span>
              <UiMembershipDropdownMenu
                :key="currentCountyName"
                class="address-dropdown-menus-item__dropdown-menu"
                style="width: 100%"
                :options="twDistrictsOptions"
                :state="dropdownMenuStateDistrict"
                @change="handleDropdownMenuDistrictChange"
              />
            </label>
          </div>
          <input
            v-model.trim="$v.addressInput.$model"
            :class="[
              'input',
              { 'input--invalid': isAddressInputInvalid },
              'address-wrapper__address-input',
            ]"
            type="text"
            placeholder="請輸入地址"
          />
          <p v-show="shouldShowAddressInvalidHint" class="invalid-hint">
            請填寫完整地址
          </p>
        </div>
        <button class="form__submit-button submit-button" @click="handleSubmit">
          儲存
        </button>
      </form>
      <button class="wrapper__cancel-membership cancel-membership">
        刪除會員
      </button>
    </div>
  </section>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, requiredIf, between } from 'vuelidate/lib/validators'
import UiMembershipDropdownMenu from '~/components/UiMembershipDropdownMenu.vue'
import countriesData from '~/constants/countries.json'
import twDistrictsData from '~/constants/taiwan-districts.json'

export default {
  components: {
    UiMembershipDropdownMenu,
  },
  mixins: [validationMixin],
  validations: {
    birthdayYear: {
      required,
      between: between(1911, new Date().getFullYear()),
    },
    birthdayMonth: {
      required,
      between: between(1, 12),
    },
    birthdayDay: {
      required,
      between: between(1, 31),
    },
    birthdayGroup: ['birthdayYear', 'birthdayMonth', 'birthdayDay'],

    addressCountry: {
      required,
    },
    addressCounty: {
      required: requiredIf(function isCurrentCountryTw() {
        return !this.isCountryNotTw
      }),
    },
    addressDistrict: {
      required: requiredIf(function isCurrentCountryTw() {
        return !this.isCountryNotTw
      }),
    },
    addressInput: {
      required,
    },
    addressGroup: [
      'addressCountry',
      'addressCounty',
      'addressDistrict',
      'addressInput',
    ],
  },
  data() {
    return {
      birthdayYear: undefined,
      birthdayMonth: undefined,
      birthdayDay: undefined,

      addressCountry: {},
      addressCounty: {},
      addressDistrict: {},
      addressInput: '',

      isSubmitButtonClicked: false,
    }
  },
  computed: {
    currentMemberEmail() {
      return this.$store.state.membership.user.email
    },

    countriesOptions() {
      return countriesData.map(function getTraditionalChineseName(country) {
        return country.Taiwan
      })
    },
    twCountiesOptions() {
      return twDistrictsData.map(function getCountyName(county) {
        return county.name
      })
    },
    twDistrictsOptions() {
      const districts = this.addressCounty.districts ?? []
      return districts.map(function getDistrictsName(district) {
        return district.name
      })
    },

    isCountryNotTw() {
      return this.addressCountry.ISO2 !== 'TW'
    },
    dropdownMenuStateCounty() {
      if (this.isCountryNotTw) {
        return 'disable'
      }
      if (this.isAddressCountyInvalid) {
        return 'invalid'
      }
      return 'normal'
    },
    dropdownMenuStateDistrict() {
      if (this.isCountryNotTw) {
        return 'disable'
      }
      if (this.isAddressDistrictInvalid) {
        return 'invalid'
      }
      return 'normal'
    },

    currentCountryCode() {
      return this.addressCountry.ISO2 ?? 'countryCode'
    },
    currentCountyName() {
      return this.addressCounty.name ?? 'countyName'
    },

    shouldShowBirthdayInvalidHint() {
      return (
        this.isSubmitButtonClicked &&
        this.$v.birthdayGroup.$invalid &&
        this.$v.birthdayGroup.$anyDirty
      )
    },
    isBirthdayYearInvalid() {
      return this.shouldShowBirthdayInvalidHint && this.$v.birthdayYear.$invalid
    },
    isBirthdayMonthInvalid() {
      return (
        this.shouldShowBirthdayInvalidHint && this.$v.birthdayMonth.$invalid
      )
    },
    isBirthdayDayInvalid() {
      return this.shouldShowBirthdayInvalidHint && this.$v.birthdayDay.$invalid
    },

    shouldShowAddressInvalidHint() {
      return (
        this.isSubmitButtonClicked &&
        this.$v.addressGroup.$invalid &&
        this.$v.addressGroup.$anyDirty
      )
    },
    isAddressCountryInvalid() {
      return (
        this.shouldShowAddressInvalidHint && this.$v.addressCountry.$invalid
      )
    },
    isAddressCountyInvalid() {
      return this.shouldShowAddressInvalidHint && this.$v.addressCounty.$invalid
    },
    isAddressDistrictInvalid() {
      return (
        this.shouldShowAddressInvalidHint && this.$v.addressDistrict.$invalid
      )
    },
    isAddressInputInvalid() {
      return this.shouldShowAddressInvalidHint && this.$v.addressInput.$invalid
    },
  },
  methods: {
    handleDropdownMenuCountryChange(value) {
      this.addressCountry = countriesData.find(function findByTwName(country) {
        return country.Taiwan === value
      })
      this.$v.addressCountry.$touch()
      this.addressCounty = {}
      this.addressDistrict = {}
    },
    handleDropdownMenuCountyChange(value) {
      this.addressCounty = twDistrictsData.find(function findByName(county) {
        return county.name === value
      })
      this.$v.addressCounty.$touch()
      this.addressDistrict = {}
    },
    handleDropdownMenuDistrictChange(value) {
      const district = this.addressCounty.districts ?? []
      this.addressDistrict = district.find(function findByName(district) {
        return district.name === value
      })
      this.$v.addressDistrict.$touch()
    },
    limitNumberWithRange(number, min, max) {
      return Math.min(Math.max(number, min), max)
    },
    handleInputBirthdayYearChange() {
      this.birthdayYear = this.limitNumberWithRange(
        this.birthdayYear,
        1911,
        new Date().getFullYear()
      )
    },
    handleDropdownMenuBirthdayMonthChange(value) {
      this.birthdayMonth = value
      this.$v.birthdayMonth.$touch()
    },
    handleInputBirthdayDayChange() {
      this.birthdayDay = this.limitNumberWithRange(this.birthdayDay, 1, 31)
    },
    handleSubmit() {
      if (!this.isSubmitButtonClicked) {
        this.isSubmitButtonClicked = true
      }
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
  &__cancel-membership {
    margin: 34px 0 0 0;
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
  &__submit-button {
    margin: 30px 0 0 0;
  }
}
.input {
  height: 50px;
  background-color: #f2f2f2;
  padding: 15px 20px;
  font-size: 16px;
  color: #4a4a4a;
  border: 1px solid transparent;
  &::placeholder {
    color: #888888;
  }
  &--invalid {
    border: 1px solid #d0021b;
    &::placeholder {
      color: #d0021b;
    }
  }
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

.invalid-hint {
  color: #d0021b;
  margin: 5px 0 0 0;
}

.submit-button {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #204f74;
  color: white;
  font-weight: 900;
}

.cancel-membership {
  text-decoration: underline;
  color: #d0021b;
  font-size: 18px;
  font-weight: 700;
}
</style>
