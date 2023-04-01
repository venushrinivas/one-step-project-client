<template>
    <div class="container">
        <div id="alert" class="alert d-none alert-success alert-dismissible fade show" role="alert">
            Your message was sent successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <div class="loader" v-if="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div v-else>
            <div class="d-flex justify-content-end">
                <button v-if="devices.previous_page" type="button" class="btn btn-primary m-1"
                        @click="fetchData(devices.page_number - 1, true)">Previous Page
                </button>
                <button v-if="devices.next_page" type="button" class="btn btn-primary m-1"
                        @click="fetchData(devices.page_number + 1, true)">Next Page
                </button>
            </div>
            <div style="height: 30vh" class="table-responsive">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Display Name</th>
                        <th>Active State</th>
                        <th>Online</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Altitude</th>
                        <th>Drive Status</th>
                        <th>Icon</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="device in devices.devices" :key="device.device_id">
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
                        <td><img style="width: 20px" :src="serverPath+device.image" :alt="device.image"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <GoogleMap :api-key="apiKey" style="width: 100%; height: 500px" :center="{ lat: 37.0902, lng: -95.7129 }" :zoom="4">
                <Marker v-for="device in devices.devices" :key="device.device_id" :options="{ position: { lat: device.latest_accurate_device_point.lat, lng: device.latest_accurate_device_point.lng }, icon:  {url: serverPath+device.image, scaledSize: {height: 20, width: 20}}}" />
            </GoogleMap>
        </div>
    </div>
</template>
<style>
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<script>
import axios from "axios";
import { GoogleMap, Marker } from "vue3-google-map";
import URLConstants from "@/constants/URLConstants";
export default {
    name: 'HomeComponent',
    components: {GoogleMap, Marker},
    data() {
        return {
            loading: false,
            devices: {},
            serverPath: process.env.VUE_APP_SERVER_URL,
            apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
        }
    },
    mounted() {
        this.fetchData(1, true);
        setInterval(() => {
            this.fetchData(this.devices.page_number ? this.devices.page_number : 1, false);
        }, 50000);
    },

    methods: {
        fetchData(page, enableLoading) {
            if(enableLoading) {
                this.loading = true
            }
            axios.get(URLConstants.DEVICES_URL + page)
                .then(response => {
                    if(enableLoading) {
                        this.loading = false
                    }
                    this.devices = response.data;
                }).catch(err => {
                if(enableLoading) {
                    this.loading = false
                }
                this.showAlertMessage("danger", err)
            })
        },
        showAlertMessage(type, message) {
            if (type === "success") {
                document.getElementById("alert").classList.remove("alert-danger")
                document.getElementById("alert").classList.add("alert-success")
            } else {
                document.getElementById("alert").classList.add("alert-danger")
                document.getElementById("alert").classList.remove("alert-success")
            }
            document.getElementById("alert").classList.remove("d-none")
            document.getElementById("alert").innerText = message;
            setTimeout(() => {
                document.getElementById("alert").classList.add("d-none")
            }, 2000);
        },
    }
}
</script>