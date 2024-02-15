<script setup>
import { computed, ref, watch } from "vue"
import SplitFlatDisplay from "./SplitFlatDisplay.vue"

const totalSecondsLeft = ref(Number(localStorage.getItem("totalSecondsLeft")) || 1209600) // 14 days
watch(totalSecondsLeft, (oldValue, newValue) => {
  // Save countdown to local storage
  localStorage.setItem("totalSecondsLeft", newValue - 1)
})

const seconds = computed(() => totalSecondsLeft.value % 60)
const days = computed(() => parseInt(totalSecondsLeft.value / 3600 / 24))
const hours = computed(() => parseInt((totalSecondsLeft.value / 3600) % 24))
const minutes = computed(() => parseInt(totalSecondsLeft.value / 60) % 60)

function startCountdown() {
  const interval = setInterval(() => {
    totalSecondsLeft.value--
    if (totalSecondsLeft.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}
startCountdown()

</script>

<template>
  <div class="mt-[60px] lg:mt-[101px] flex max-lg:flex-col gap-[14px] lg:gap-[32px]">
    <SplitFlatDisplay :value="days" desc="Days" />
    <SplitFlatDisplay :value="hours" desc="Hours" />
    <SplitFlatDisplay :value="minutes" desc="Minutes" />
    <SplitFlatDisplay :value="seconds" desc="Seconds" />
  </div>
</template>
