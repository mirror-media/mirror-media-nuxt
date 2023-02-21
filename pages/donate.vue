<!-- 
  考量未來會在網站上實作捐款頁的需求，因此採用獨立的 page 檔案，並在上面實作轉址到外部連結，而不是修改既有的捐款按鈕的連結資訊，
  未來要實作捐款頁時，可以直接在該檔案中進行修改即可。
-->

<template>
  <p>Donation Page</p>
</template>

<script>
import { DONATION_PAGE_URL } from '~/configs/config'

export default {
  middleware: ({ redirect }) => {
    redirect(DONATION_PAGE_URL)
  },
}
</script>
