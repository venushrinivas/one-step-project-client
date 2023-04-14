<template>
    <div id="alert" ref="alert" :class="alertClass" role="alert">
        {{ alert.message }}
        <button @click="close" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
    data() {
        return {
            intervalId: null,
        }
    },
    mounted() {
        if(this.alert.autoCloseDelay) {
            this.intervalId = setTimeout(() => {
                this.$emit('close')
            }, this.alert.autoCloseDelay)
        }
    },
    computed: {
        alertClass() {
            return `alert alert-${this.alert.type} alert-dismissible fade show`
        }
    },
    methods: {
        close() {
            if(this.intervalId != null) {
                clearTimeout(this.intervalId)
            }
            this.$emit('close')
        }
    }
}
</script>
<style scoped>
.alert {
    position: fixed;
    right: 20px;
}
</style>
