<template>
    <div class="loader" v-if="loading">
        <div class="spinner-border text-primary justify-content-" role="status">
            <span class="sr-only">{{ TextConstants.LOADING }}</span>
        </div>
    </div>
    <div v-else class="container-fluid d-flex flex-column">
        <AlertComponent v-if="alert.show" :alert="alert" @close="alert.show = false"/>
        <HomeTable v-model:tableData="tableData" :pagination="pagination" :deviceRowClicked="deviceRowClicked"/>
        <br/>

        <button v-if="reset" type="button" class="btn btn-primary m-1" @click="resetZoom">
            {{ TextConstants.RESET_ZOOM }}
        </button>
        <GoogleMap :api-key="apiKey" class="map" :center="center"
                   :zoom="zoom">
            <Marker v-for="device in devices.devices" :key="device.device_id"
                    :options="{ position: { lat: device.latest_accurate_device_point.lat, lng: device.latest_accurate_device_point.lng }, icon:  {url: getImageSource(device.image), scaledSize: {height: 20, width: 20}}}"/>
        </GoogleMap>
    </div>
</template>
<style scoped>
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
}

.map {
    width: 100%;
    height: 100%;
}

.container-fluid {
    padding-top: 10vh;
}
</style>

<script>
import axios from "axios";
import {GoogleMap, Marker} from "vue3-google-map";
import URLConstants from "@/constants/URLConstants";
import {getAlertObject, getImageSource} from "@/util/commons";
import TextConstants from "../constants/TextConstants";
import AlertComponent from "@/components/AlertComponent.vue";
import HomeTable from "@/components/HomeTable.vue";

export default {
    name: 'HomeComponent',
    computed: {
        TextConstants() {
            return TextConstants
        },
    },
    components: {HomeTable, AlertComponent, GoogleMap, Marker},
    data() {
        return {
            loading: false,
            devices: {},
            tableData:[],
            apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
            intervalId: null,
            center: {lat: 37.0902, lng: -95.7129},
            zoom: 4,
            reset: false,
            alert: {
                type: "",
                message: "",
                show: false
            },
            pagination: {
                nextPage: false,
                previousPage: false,
                pageNumber: 1,
                navigate: (pageNumber) => {
                    this.navigatePage(pageNumber, true)
                },
            },
        }
    },
    mounted() {
        this.fetchData(1, true);
        this.intervalId = setInterval(() => {
            this.fetchData(this.devices.page_number ? this.devices.page_number : 1, false);
        }, 10000);
    },
    beforeUnmount() {
        clearInterval(this.intervalId);
    },

    methods: {
        getImageSource,
        navigatePage(page, enableLoading) {
            this.resetZoom()
            return this.fetchData(page, enableLoading)
        },
        fetchData(page, enableLoading) {
            if (enableLoading) {
                this.loading = true
            }
            axios.get(URLConstants.DEVICES_URL + page)
                .then(response => {
                    if (enableLoading) {
                        this.loading = false
                    }
                    this.devices = response.data;
                    this.tableData = [];
                    this.pagination.nextPage = this.devices.next_page;
                    this.pagination.previousPage = this.devices.previous_page;
                    this.pagination.pageNumber = this.devices.page_number;
                    for (let device of response.data.devices) {
                        this.tableData.push({
                            ...device,
                            lat: device.latest_accurate_device_point.lat,
                            lng: device.latest_accurate_device_point.lng,
                            altitude: device.latest_accurate_device_point.altitude,
                            drive_status: device.latest_accurate_device_point.device_state.drive_status
                        })
                    }
                }).catch(err => {
                if (enableLoading) {
                    this.loading = false
                }
                this.alert = getAlertObject("danger", err, true, 2000);
            })
        },
        deviceRowClicked(device) {
            this.center = {lat: device.latest_accurate_device_point.lat, lng: device.latest_accurate_device_point.lng}
            this.zoom = 15
            this.reset = true
        },
        resetZoom() {
            this.center = {lat: 37.0902, lng: -95.7129}
            this.zoom = 4
            this.reset = false
        }
    }
}
</script>