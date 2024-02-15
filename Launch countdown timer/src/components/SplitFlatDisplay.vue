<script setup>
import { computed, watch, ref } from "vue"

const props = defineProps({
  value: Number,
  desc: String,
})

const oldValue = ref(props.value || 0)
const topCardRef = ref(null)

watch(
  // Watches for changes in the display value
  computed(() => props.value),
  (oldVal) => {
    // Flipping animation
    topCardRef.value.animate(
      {
        transform: ["rotateX(0deg)", "rotateX(-180deg)", "rotateX(-180deg)"],
      },
      { duration: 900 }
    )

    setTimeout(() => {
      oldValue.value = oldVal
    }, 800)
  }
)

function formatNumber(n) {
  let str = String(n)
  return str.length < 2 ? `0${n}` : str
}
</script>

<template>
  <div class="flex items-center select-none lg:flex-col gap-[25px]">
    <div class="w-[100px] h-[94px] lg:w-[148px] lg:h-[140px] relative display">
      <div class="next-card rounded-t-md lg:rounded-t-lg">
        <span class="text-[54px] lg:text-[80px]">{{ formatNumber(value) }}</span>
      </div>
      <div ref="topCardRef" class="top-card rounded-t-md lg:rounded-t-lg">
        <div class="top-card-face top-card-face--front rounded-t-md lg:rounded-t-lg">
          <span class="text-[54px] lg:text-[80px]">{{ formatNumber(oldValue) }}</span>
        </div>
        <div class="top-card-face top-card-face--back rounded-t-md lg:rounded-t-lg">
          <span class="text-[54px] lg:text-[80px]">{{ formatNumber(value) }}</span>
        </div>
      </div>
      <hr
        class="absolute top-1/2 -translate-y-1/2 w-full z-[1000] border-t-px border-t-very-dark-mostly-black-blue/40 border-t-[1px]"
      />
      <div
        class="bottom-card rounded-b-md lg:rounded-b-lg shadow-[0px_5px_hsl(234,_17%,_12%)] lg:shadow-[0px_10px_hsl(234,_17%,_12%)]"
      >
        <span class="text-[54px] lg:text-[80px]">{{ formatNumber(oldValue) }}</span>
      </div>
    </div>
    <span class="uppercase tracking-[0.2rem] lg:tracking-[0.4rem] text-[13px] lg:text-[14px] text-grayish-blue">{{ desc }}</span>
  </div>
</template>

<style lang="scss" scoped>
.display {
  perspective: 350px;
}

// Card holes
.next-card,
.top-card-face,
.bottom-card {
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: hsl(234, 17%, 12%);
    border-radius: 100%;

    @media (max-width: 800px) {
      width: 10px;
      height: 10px;
    }
  }
}

.next-card,
.top-card-face--front,
.top-card-face--back {
  &::before {
    top: 100%;
    left: 0;
    transform: translate(-50%, -50%);
  }

  &::after {
    top: 100%;
    right: 0;
    transform: translate(50%, -50%);
  }
}

.bottom-card {
  &::before {
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }

  &::after {
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }
}

.next-card {
  position: relative;
  background-color: #2c2c44;
  width: 100%;
  height: 50%;
  overflow: hidden;
}

.next-card span,
.top-card span {
  color: #d75172;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.top-card {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #2c2c44;
  width: 100%;
  height: 50%;
  transform-style: preserve-3d;
  z-index: 1000;
  transform-origin: bottom center;
  transform: translateZ(1px);

  .top-card-face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    overflow: hidden;

    &.top-card-face--back {
      transform: rotateY(180deg);
      background-color: hsl(236 21% 26%);

      span {
        color: hsl(345, 95%, 68%);
        transform: translate(-50%, -50%) rotateZ(180deg);
      }
    }
  }
}

.bottom-card {
  width: 100%;
  height: 50%;
  background-color: hsl(236, 21%, 26%);
  position: relative;
  overflow: hidden;

  span {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    color: hsl(345, 95%, 68%);
  }
}
</style>
