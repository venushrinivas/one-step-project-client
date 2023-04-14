<template>
    <div id="alert" ref="alert" :class="alertClass" role="alert">
        {{ alert.message }}
        <button @click="$emit('close')" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
</template>

<script>
export default {
    name: "AlertComponent",
    props: {
        alert: {
            type: Object
        },
    },
    computed: {
        alertClass() {
            return `alert alert-${this.alert.type} alert-dismissible fade show`
        }
    },
}
</script>
<style scoped>
.alert {
    position: fixed;
    right: 20px;
}
</style>
