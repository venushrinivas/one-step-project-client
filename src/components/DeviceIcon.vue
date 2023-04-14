<template>
    <img class="device-icon" :src="getImageSource(row.image)" :alt="row.image">
</template>

<script>
import {getImageSource} from "@/util/commons";

export default {
    name: "DeviceIcon",
    methods: {getImageSource},
    props: {
        row:{

        }
    }
}
</script>

<style scoped>
.device-icon {
    width: 20px;
    height: 20px;
}
</style>