<template>
    <div class="container">
        <div id="alert" ref="alert" class="alert d-none alert-success alert-dismissible fade show" role="alert">
            {{ TextConstants.ALERT_SUCCESS }}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div class="loader" v-if="loading">
            <div class="spinner-border text-primary justify-content-" role="status">
                <span class="sr-only">{{ TextConstants.LOADING }}</span>
            </div>
        </div>
        <div v-else>
            <div class="d-flex justify-content-between">
            <span class="d-flex align-items-center">
                {{TextConstants.CLICK_ROW_TEXT}}
            </span>
                <div>
                    <button v-if="devices.previous_page" type="button" class="btn btn-primary m-1"
                            @click="navigatePage(devices.page_number - 1, true)">{{ TextConstants.PREVIOUS_PAGE }}
                    </button>
                    <button v-if="devices.next_page" type="button" class="btn btn-primary m-1"
                            @click="navigatePage(devices.page_number + 1, true)">{{ TextConstants.NEXT_PAGE }}
                    </button>
                </div>
            </div>
            <div class="table-responsive device-table-height">
                <table class="table">
                    <thead>
                    <tr>
                        <th>{{ TextConstants.DEVICE_ID }}</th>
                        <th>{{ TextConstants.DISPLAY_NAME }}</th>
                        <th>{{ TextConstants.ACTIVE_STATE }}</th>
                        <th>{{ TextConstants.ONLINE }}</th>
                        <th>{{ TextConstants.LATITUDE }}</th>
                        <th>{{ TextConstants.LONGITUDE }}</th>
                        <th>{{ TextConstants.ALTITUDE }}</th>
                        <th>{{ TextConstants.DRIVE_STATUS }}</th>
                        <th>{{ TextConstants.ICON }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="device in devices.devices" :key="device.device_id" @click="deviceRowClicked(device)">
                        <td>{{ device.device_id }}</td>
                        <td>{{ device.display_name }}</td>
                        <td>
                            {{ device.active_state }}
                        </td>
                        <td>
                            {{ device.online }}
                        </td>
                        <td>{{ device.latest_accurate_device_point.lat }}</td>
                        <td>{{ device.latest_accurate_device_point.lng }}</td>
                        <td>{{ device.latest_accurate_device_point.altitude }}</td>
                        <td>{{ device.latest_accurate_device_point.device_state.drive_status }}</td>
                        <td><img class="device-icon" :src="getImageSource(device.image)" :alt="device.image"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
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
    </div>
</template>
<style scoped>
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
}

.device-table-height {
    height: 30vh;
}

.device-icon {
    width: 20px;
    height: 20px;
}

.map {
    width: 100%;
    height: 500px
}
</style>

<script>
import axios from "axios";
import {GoogleMap, Marker} from "vue3-google-map";
import URLConstants from "@/constants/URLConstants";
import {getImageSource, showAlertMessage} from "@/util/commons";
import TextConstants from "../constants/TextConstants";

export default {
    name: 'HomeComponent',
    computed: {
        TextConstants() {
            return TextConstants
        },
    },
    components: {GoogleMap, Marker},
    data() {
        return {
            loading: false,
            devices: {},
            apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
            intervalId: null,
            center: {lat: 37.0902, lng: -95.7129},
            zoom: 4,
            reset: false
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
                }).catch(err => {
                if (enableLoading) {
                    this.loading = false
                }
                showAlertMessage("danger", err, this.$refs.alert)
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