<script setup>
import Countdown from "./components/Countdown.vue"
import SocialIcon from "./components/SocialIcon.vue"
</script>

<template>
  <div class="flex flex-col items-center mt-[72px] lg:mt-[134px] flex-1">
    <h1
      class="mx-[20px] uppercase font-bold text-[1.2rem] lg:text-[1.37rem] text-center leading-tight lg:leading-normal tracking-[0.3rem] lg:tracking-[0.47rem] text-white"
    >
      We're launching soon
    </h1>
    <Countdown />
  </div>

  <div class="flex gap-[32px] lg:absolute lg:bottom-[72px] max-lg:mb-[72px] max-lg:mt-[60px]">
    <SocialIcon name="facebook" />
    <SocialIcon name="pinterest" />
    <SocialIcon name="instagram" />
  </div>
</template>
