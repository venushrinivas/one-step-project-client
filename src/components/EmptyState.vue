<template>
    <div class="empty-state d-flex justify-content-center align-items-center">
        {{ message }}
    </div>
</template>

<script>
export default {
    name: "EmptyState",
    props: {
        message: {
            type: String
        }
    }
}
</script>

<style scoped>
.empty-state {
    width: 100%;
}
</style>