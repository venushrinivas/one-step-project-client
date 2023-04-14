<template>
    <div class="table-responsive">
        <table class="table">
            <thead>
            <tr>
                <th v-for="column in data.columns" :key="column.id">{{ column.name }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in data.rows" :key="row[data.key]" @click="rowClicked(row)">
                <td v-for="column in data.columns" :key="column.id">
                    <component v-if="column.dynamic" :is="column.component" :row="row">
                    </component>
                    <span v-else>
                      {{ row[column.id] }}
                    </span>
                </td>
            </tr>
            </tbody>
        </table>
        <span v-if="!data || !data.rows || data.rows.length === 0">
            <EmptyState :message="TextConstants.NO_DEVICE_AVAILABLE"/>
        </span>
    </div>
</template>

<script>
import EmptyState from "@/components/EmptyState.vue";
import TextConstants from "@/constants/TextConstants";

export default {
    name: "TableComponent",
    computed: {
        TextConstants() {
            return TextConstants
        }
    },
    components: {EmptyState},
    props: {
        data: {}
    },
    methods: {
        rowClicked(row) {
            if(this.data.rowClicked) {
                this.data.rowClicked(row)
            }
        }
    }
}
</script>

<style scoped>

</style>