<template>
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
      <div
        v-show="
          currentUserProvider === 'emailLink' ||
          currentUserProvider === 'password'
        "
        class="form__item-wrapper password-wrapper"
      >
        <h2 class="password-wrapper__subtitle subtitle">密碼</h2>
        <a
          href="/updatePassword"
          class="password-wrapper__update-password-button update-password-button"
        >
          更改密碼
        </a>
      </div>
      <div class="form__item-wrapper name-wrapper">
        <label class="name-wrapper__subtitle subtitle" for="profile-name-input">
          姓名
        </label>
        <input
          id="profile-name-input"
          v-model="name"
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
          :defaultIndex="genderDefaultIndex"
          :options="['不透露', '男', '女']"
          style="width: 90px"
          @change="handleDropdownMenuGenderChange"
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
            :defaultIndex="birthdayMonthDefaultIndex"
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
            style="width: 104px"
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
          v-model="phone"
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
              :defaultIndex="addressCountryDefaultIndex"
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
              :defaultIndex="addressCountyDefaultIndex"
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
              :defaultIndex="addressDistrictDefaultIndex"
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
          placeholder="請輸入街道、門號、巷弄、樓層等資訊"
        />
        <p v-show="shouldShowAddressInvalidHint" class="invalid-hint">
          請填寫完整地址
        </p>
      </div>
      <button class="form__submit-button submit-button" @click="handleSubmit">
        儲存
      </button>
    </form>
    <a
      href="/cancelMembership"
      class="wrapper__cancel-membership-link cancel-membership-link"
    >
      刪除會員
    </a>
    <p class="cancel-membership-hint">
      提醒您，若您有訂閱會員專區單篇文章，刪除帳號可能導致無法閱讀文章
    </p>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, requiredIf, between } from 'vuelidate/lib/validators'
import countriesData from 'mirror-media-constants/lib/countries.json'
import twDistrictsData from 'mirror-media-constants/lib/taiwan-districts.json'
import dayjs from '~/utils/dayjs'
import UiMembershipDropdownMenu from '~/components/UiMembershipDropdownMenu.vue'
import userUpdate from '~/apollo/mutations/userUpdate.gql'
import { fetchMemberProfile } from '~/apollo/queries/userQuery.gql'

export default {
  apollo: {
    $client: 'memberSubscription',
    member: {
      query: fetchMemberProfile,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          firebaseId: this.$store.state.membership.userUid,
        }
      },
      result({ data }) {
        const getGender = (gender) => {
          if (typeof gender === 'number') {
            switch (gender) {
              case 1:
                return '男'
              case 2:
                return '女'
              case 3:
                return '不透露'
              default:
                return null
            }
          } else {
            switch (gender) {
              case 'A_1':
              case 'M':
                return '男'
              case 'A_2':
              case 'F':
                return '女'
              case 'A_3':
              case 'NA':
                return '不透露'
              default:
                return null
            }
          }
        }
        this.id = data?.member?.id
        this.name = data?.member?.name ?? null

        const gender = getGender(data?.member?.gender)
        this.gender = gender
        this.genderDefaultIndex = ['不透露', '男', '女'].indexOf(gender)

        const birthdayObj = dayjs.utc(data?.member?.birthday ?? null)
        this.birthdayYear = birthdayObj.year()
        const month = birthdayObj.month()
        this.birthdayMonth = typeof month === 'number' ? month + 1 : null
        this.birthdayMonthDefaultIndex =
          typeof month === 'number' ? month : null
        this.birthdayDay = birthdayObj.date()

        this.phone = data?.member?.phone ?? null

        const countryIndex = countriesData.findIndex((country) => {
          return country.Taiwan === data?.member?.country
        })
        this.addressCountry = countriesData?.[countryIndex] ?? {}
        this.addressCountryDefaultIndex = countryIndex

        const countyIndex = twDistrictsData.findIndex(function findByName(
          county
        ) {
          return county.name === data?.member?.city
        })

        this.addressCounty = twDistrictsData?.[countyIndex] ?? {}
        this.addressCountyDefaultIndex = countyIndex

        const districtIndex = (this.addressCounty?.districts ?? []).findIndex(
          (district) => {
            return district?.name === data?.member?.district
          }
        )
        this.addressDistrict = this.addressCounty?.districts?.[districtIndex]
        this.addressDistrictDefaultIndex = districtIndex

        this.addressInput = data?.member?.address
      },
      prefetch: false,
    },
  },
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
      id: undefined,
      name: undefined,
      gender: undefined,
      genderDefaultIndex: undefined,

      birthdayYear: undefined,
      birthdayMonth: undefined,
      birthdayMonthDefaultIndex: undefined,
      birthdayDay: undefined,

      phone: undefined,

      addressCountry: {},
      addressCountryDefaultIndex: undefined,
      addressCounty: {},
      addressCountyDefaultIndex: undefined,
      addressDistrict: {},
      addressDistrictDefaultIndex: undefined,
      addressInput: '',

      isSubmitButtonClicked: false,
    }
  },
  computed: {
    currentMemberEmail() {
      /*
       * if this member has no email (for fb login with no email)
       * it's stored email will be like `[0x001] - firebaseId:${uid}`
       * if we find this kind of email, justgive it an empty email
       */
      if (this.$store.state.membership.userEmail?.includes('[0x001] ')) {
        return ''
      } else {
        return this.$store.state.membership.userEmail
      }
    },

    countriesTwIndex() {
      return countriesData.findIndex(function findTw(country) {
        return country.ISO2 === 'TW'
      })
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
      const districts = this.addressCounty?.districts ?? []
      return districts.map(function getDistrictsName(district) {
        return district.name
      })
    },

    isCountryNotTw() {
      return this.addressCountry?.ISO2 !== 'TW'
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
      return this.addressCountry?.ISO2 ?? 'countryCode'
    },
    currentCountyName() {
      return this.addressCounty?.name ?? 'countyName'
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

    currentUserProvider() {
      return this.$fire.auth?.currentUser?.providerData?.[0]?.providerId ?? ''
    },
  },
  methods: {
    handleDropdownMenuGenderChange(value) {
      this.gender = value
    },

    handleDropdownMenuCountryChange(value) {
      this.addressCountry = countriesData.find(function findByTwName(country) {
        return country.Taiwan === value
      })
      this.$v.addressCountry.$touch()
      this.addressCounty = {}
      this.addressCountyDefaultIndex = null
      this.addressDistrict = {}
      this.addressDistrictDefaultIndex = null
    },
    handleDropdownMenuCountyChange(value) {
      this.addressCounty = twDistrictsData.find(function findByName(county) {
        return county.name === value
      })
      this.$v.addressCounty.$touch()
      this.addressDistrict = {}
      this.addressDistrictDefaultIndex = null
    },
    handleDropdownMenuDistrictChange(value) {
      const district = this.addressCounty?.districts ?? []
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

    createProfilePayload() {
      const getGender = () => {
        switch (this.gender) {
          case '不透露':
            return 'NA'
          case '男':
            return 'M'
          case '女':
            return 'F'
          default:
            return null
        }
      }

      const getBirthday = () => {
        if (!this.birthdayYear || !this.birthdayMonth || !this.birthdayDay) {
          return null
        }
        const date = `${this.birthdayYear}-${this.birthdayMonth}-${this.birthdayDay}`
        return dayjs.utc(date).format('YYYY-MM-DD')
      }

      const getAddress = () => {
        /*
         * if (
         *   !getTraditionalChineseName(this.addressCountry) ||
         *   !getCountyName(this.addressCounty) ||
         *   !getDistrictsName(this.addressDistrict) ||
         *   !this.addressInput
         * ) {
         *   return null
         * }
         */
        return {
          country: getTraditionalChineseName(this.addressCountry),
          city: getCountyName(this.addressCounty),
          district: getDistrictsName(this.addressDistrict),
          address: this.addressInput,
        }

        // TODO: duplicated usage function, should refactor
        function getTraditionalChineseName(country) {
          return country?.Taiwan ?? ''
        }
        function getCountyName(county) {
          return county?.name ?? ''
        }
        function getDistrictsName(district) {
          return district?.name ?? ''
        }
      }

      return {
        // firebaseId: this.$store.state.membership.userUid,
        id: this.id,
        name: this.name || '',
        gender: getGender() || 'NA',
        birthday: getBirthday() || '',
        phone: this.phone || '',
        country: getAddress().country || '',
        city: getAddress().city || '',
        district: getAddress().district || '',
        address: getAddress().address || '',
      }
    },
    async handleSubmit() {
      if (!this.isSubmitButtonClicked) {
        this.isSubmitButtonClicked = true
      }
      if (
        !this.shouldShowAddressInvalidHint &&
        !this.shouldShowBirthdayInvalidHint
      ) {
        try {
          await this.$apollo.mutate({
            mutation: userUpdate,
            variables: this.createProfilePayload(),
          })
          this.$emit('success')
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
          this.$emit('error')
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  &__form {
    margin: 30px 0 0 0;
  }
  &__cancel-membership-link {
    margin: 34px 0 0 0;
  }
  @include media-breakpoint-up(xl) {
    max-width: 680px;
    margin: 0 auto;
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
  @include media-breakpoint-up(xl) {
    border: 1px solid #d8d8d8;
    padding: 40px;
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
  display: flex;
  flex-direction: column;
  &__input-birthday-day {
    margin: 20px 0 0 0;
  }
  &__dropdown-menu-birthday-month {
    margin: 20px 0 0 0;
  }
  @include media-breakpoint-up(xl) {
    flex-direction: row;
    &__input-birthday-day {
      margin: 0 0 0 20px;
    }
    &__dropdown-menu-birthday-month {
      margin: 0 0 0 20px;
    }
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
  @include media-breakpoint-up(xl) {
    width: 120px;
    margin-left: auto;
    margin-right: auto;
  }
}

.cancel-membership-link {
  display: inline-block;
  text-decoration: underline;
  color: #d0021b;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.update-password-button {
  width: 98px;
  height: 38px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.66);
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.66);
  }
  &:active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)),
      #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.66);
  }
}

.cancel-membership-hint {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #888888;
}
</style>
