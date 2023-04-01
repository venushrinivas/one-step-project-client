<template>
    <div class="container">
        <div id="alert" class="alert d-none alert-success alert-dismissible fade show" role="alert">
            Your message was sent successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <h1>Preferences</h1>
        <hr/>
        <div class="loader" v-if="loading">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <form v-else>
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">
                    Sort Column</label>
                <div class="col-sm-10">
                    <select v-model="preferences.sort_column" class="form-select">
                        <option value="display_name">Display Name</option>
                        <option value="device_id">Device ID</option>
                        <option value="active_state">Active State</option>
                        <option value="online">Online</option>
                        <option value="lat">Latitude</option>
                        <option value="lng">Longitude</option>
                        <option value="altitude">Altitude</option>
                        <option value="drive_status">Drive Status</option>
                    </select>
                </div>
            </div>
            <div class="mb-3 row">
                <label class="col-form-label col-sm-2 pt-0">Sort Order</label>
                <div class="col-sm-10">
                    <div class="form-check">
                        <input v-model="sortedOrder" class="form-check-input" type="radio"
                               name="gridRadios" id="r1" value="true">
                        <label class="form-check-label" for="r1">
                            Ascending
                        </label>
                    </div>
                    <div class="form-check">
                        <input v-model="sortedOrder" class="form-check-input" type="radio"
                               name="gridRadios" id="r2" value="false">
                        <label class="form-check-label" for="r2">
                            Descending
                        </label>
                    </div>
                </div>
            </div>
            <div class="mb-3 row">
                <label class="col-form-label col-sm-2 pt-0">Number of Rows</label>
                <div class="col-sm-10">
                    <select v-model="numberOfRows" class="form-select">
                        <option value="-1">All</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>
            <label class="col-form-label col-sm-2 pt-0 fw-bold">Edit Device Preferences</label>
            <div style="height: 30vh" class="table-responsive">
                <table class="table">
                    <thead>
                    <tr>
                        <th>Device ID</th>
                        <th style="display: flex; align-items: center">
                            <span>Display Name </span>
                            <input type="text" style="width: 50%" class="form-control ms-2" v-model="searchTerm"
                                   placeholder="Search...">
                        </th>
                        <th>Hidden</th>
                        <th>Icon</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="device in filteredDevices" :key="device.device_id">
                        <td>{{ device.device_id }}</td>
                        <td>{{ device.display_name }}</td>
                        <td>
                            <input v-model="device.hidden" class="form-check-input" type="checkbox">
                        </td>
                        <td style="width: 25%;" v-if="!device.editing">
                            <img style="width: 20px" :src="serverPath+device.image" :alt="device.image">
                            <button @click="setEditMode(device)">Edit</button>
                        </td>
                        <td style="width: 25%;" v-else>
                            <input type="file" ref="fileInput" @change="handleFileUpload(device)"/>
                            <button @click.prevent="saveFile(device)">Save</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>
            <button v-on:click="save" type="button" class="btn btn-primary">Save</button>
        </form>
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
import URLConstants from "@/constants/URLConstants";

export default {
    name: 'PreferencesComponent',
    components: {},
    data() {
        return {
            preferences: {},
            loading: false,
            showAlert: false,
            searchTerm: '',
            serverPath: process.env.VUE_APP_SERVER_URL
        }
    },
    computed: {
        filteredDevices() {
            if (this.preferences.device_preferences !== undefined)
                return this.preferences.device_preferences.filter(devicePreference => {
                    return devicePreference.display_name.toLowerCase().includes(this.searchTerm.toLowerCase())
                });
            else return []
        },
        numberOfRows: {
            get() {
                return this.preferences.number_of_rows;
            },
            set(value) {
                this.preferences.number_of_rows = parseInt(value);
            }
        },
        sortedOrder: {
            get() {
                return this.preferences.ascending;
            },
            set(value) {
                this.preferences.ascending = value === "true";
            }
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            axios.get(URLConstants.PREFERENCES_URL)
                .then(response => {
                    this.loading = false
                    this.preferences = response.data
                }).catch(error => {
                this.loading = false
                this.showAlertMessage("danger", error)
            })
        },
        save() {
            axios.post(URLConstants.DEVICES_URL, "data=" + JSON.stringify(this.preferences)).then(response => {
                if (response.status === 200) {
                    this.showAlertMessage("success", response.data.message)
                }
            }).catch(error => {
                this.showAlertMessage("danger", error)
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
        setEditMode(device) {
            device.editing = true
        },
        handleFileUpload(device) {
            if (this.$refs.fileInput[0].files && this.$refs.fileInput[0].files.length > 0) {
                device.file = this.$refs.fileInput[0].files[0]
            }

        },
        async saveFile(device) {
            if (device.file) {
                const formData = new FormData()
                formData.append('file', device.file)
                let response = await axios.post(URLConstants.UPLOAD_URL + device.device_id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (response.status === 200) {
                    device.image = response.data.message
                }
            }
            device.file = undefined
            device.editing = false
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>