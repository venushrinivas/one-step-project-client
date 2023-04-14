<template>
    <div class="d-flex justify-content-between">
            <span class="d-flex align-items-center">
                {{ TextConstants.CLICK_ROW_TEXT }}
            </span>
        <div>
            <button v-if="pagination.previousPage" type="button" class="btn btn-primary m-1"
                    @click="pagination.navigate(pagination.pageNumber - 1)">{{ TextConstants.PREVIOUS_PAGE }}
            </button>
            <button v-if="pagination.nextPage" type="button" class="btn btn-primary m-1"
                    @click="pagination.navigate(pagination.pageNumber + 1)">{{ TextConstants.NEXT_PAGE }}
            </button>
        </div>
    </div>
    <TableComponent :data="tableComponentData"/>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";
import TextConstants from "../constants/TextConstants";
import DeviceIcon from "@/components/DeviceIcon.vue";
import {markRaw} from "vue";
const DeviceIconRaw = markRaw(DeviceIcon)
export default {
    name: "HomeTable",
    computed: {
        TextConstants() {
            return TextConstants
        }
    },
    props: {
        pagination: {
            type: Object
        },
        tableData:{
            type: Array,
        },
        deviceRowClicked:{
            type: Function
        }
    },
    components: {TableComponent},
    data() {
        return {
            tableComponentData: {
                key: "device_id",
                rowClicked: this.deviceRowClicked,
                columns: [
                    {
                        name: TextConstants.DEVICE_ID,
                        id: "device_id",
                        dynamic: false
                    },
                    {
                        name: TextConstants.DISPLAY_NAME,
                        id: "display_name",
                        dynamic: false
                    },
                    {
                        name: TextConstants.ACTIVE_STATE,
                        id: "active_state",
                        dynamic: false
                    },
                    {
                        name: TextConstants.ONLINE,
                        id: "online",
                        dynamic: false
                    },
                    {
                        name: TextConstants.LATITUDE,
                        id: "lat",
                        dynamic: false
                    },
                    {
                        name: TextConstants.LONGITUDE,
                        id: "lng",
                        dynamic: false
                    },
                    {
                        name: TextConstants.ALTITUDE,
                        id: "altitude",
                        dynamic: false
                    },
                    {
                        name: TextConstants.DRIVE_STATUS,
                        id: "drive_status",
                        dynamic: false
                    },
                    {
                        name: TextConstants.ICON,
                        id: "image",
                        dynamic: true,
                        component: DeviceIconRaw
                    },
                ],
                rows: this.tableData
            }
        }
    },
    watch: {
        tableData: function(newTableData) {
            this.tableComponentData.rows = newTableData;
        }
    }
}
</script>

<style scoped>

</style>