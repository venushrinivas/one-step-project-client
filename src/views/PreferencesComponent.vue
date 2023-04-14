<template>
    <div class="loader" v-if="loading">
        <div class="spinner-border text-primary" role="status">
            <span class="sr-only">{{ TextConstants.LOADING }}</span>
        </div>
    </div>
    <div v-else class="container box">
        <AlertComponent v-if="alert.show" :alert="alert" @close="alert.show = false"/>
        <div class="header">
            <h1>{{ TextConstants.PREFERENCES }}</h1>
            <hr/>
        </div>

        <form class="content">
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">
                    {{ TextConstants.SORT_COLUMN }}</label>
                <div class="col-sm-10">
                    <select v-model="preferences.sort_column" class="form-select">
                        <option value="display_name">{{ TextConstants.DISPLAY_NAME }}</option>
                        <option value="device_id">{{ TextConstants.DEVICE_ID }}</option>
                        <option value="active_state">{{ TextConstants.ACTIVE_STATE }}</option>
                        <option value="online">{{ TextConstants.ONLINE }}</option>
                        <option value="lat">{{ TextConstants.LATITUDE }}</option>
                        <option value="lng">{{ TextConstants.LONGITUDE }}</option>
                        <option value="altitude">{{ TextConstants.ALTITUDE }}</option>
                        <option value="drive_status">{{ TextConstants.DRIVE_STATUS }}</option>
                    </select>
                </div>
            </div>
            <div class="mb-3 row">
                <label class="col-form-label col-sm-2 pt-0">{{ TextConstants.SORT_ORDER }}</label>
                <div class="col-sm-10">
                    <div class="form-check">
                        <input v-model="sortedOrder" class="form-check-input" type="radio"
                               name="gridRadios" id="r1" value="true">
                        <label class="form-check-label" for="r1">
                            {{ TextConstants.ASCENDING }}
                        </label>
                    </div>
                    <div class="form-check">
                        <input v-model="sortedOrder" class="form-check-input" type="radio"
                               name="gridRadios" id="r2" value="false">
                        <label class="form-check-label" for="r2">
                            {{ TextConstants.DESCENDING }}
                        </label>
                    </div>
                </div>
            </div>
            <div class="mb-3 row">
                <label class="col-form-label col-sm-2 pt-0">{{ TextConstants.NUMBER_OF_ROWS }}</label>
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
            <label class="col-form-label col-sm-2 pt-0 fw-bold">{{ TextConstants.EDIT_DEVICE_PREFERENCES }}</label>
            <div class="table-responsive devices-table">
                <table class="table">
                    <thead>
                    <tr>
                        <th>{{ TextConstants.DEVICE_ID }}</th>
                        <th class="display-name">
                            <span>{{ TextConstants.DISPLAY_NAME }} </span>
                            <input type="text" class="form-control ms-2 search-term" v-model="searchTerm"
                                   :placeholder="TextConstants.SEARCH">
                        </th>
                        <th>{{ TextConstants.HIDDEN }}</th>
                        <th>{{ TextConstants.ICON }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="device in filteredDevices" :key="device.device_id">
                        <td>{{ device.device_id }}</td>
                        <td>{{ device.display_name }}</td>
                        <td>
                            <input v-model="device.hidden" class="form-check-input" type="checkbox">
                        </td>
                        <td class="device-icon" v-if="!device.editing">
                            <img :src="getImageSource(device.image)" :alt="device.image">
                            <button @click="setEditMode(device)">{{ TextConstants.EDIT }}</button>
                        </td>
                        <td class="device-icon" v-else>
                            <input type="file" ref="fileInput" @change="handleFileUpload(device)"/>
                            <button @click.prevent="saveFile(device)">{{ TextConstants.SAVE }}</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <span v-if="filteredDevices.length === 0">
                    <EmptyState :message="TextConstants.NO_DEVICE_AVAILABLE"/>
                </span>
            </div>
            <br/>
        </form>
        <div class="footer">
            <button v-on:click="save" type="button" class="btn btn-primary">{{ TextConstants.SAVE }}</button>
        </div>
    </div>
</template>

<style scoped>
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    padding-top: 10vh;
}

.display-name {
    display: flex;
    align-items: center
}

.search-term {
    width: 50%;
}

.device-icon {
    width: 25%;
}

.device-icon img {
    width: 20px;
}

.box {
    display: flex;
    flex-flow: column;
    height: 100%;
}

.header {
    flex: 0 1 auto;
}

.content {
    flex: 1 1 auto;
    display: flex;
    flex-flow: column;
    overflow-y: auto;
}

.footer {
    flex: 0 1 40px;
}
</style>

<script>
import axios from "axios";
import URLConstants from "@/constants/URLConstants";
import {getAlertObject, getImageSource} from "@/util/commons";
import TextConstants from "../constants/TextConstants";
import AlertComponent from "@/components/AlertComponent.vue";
import EmptyState from "@/components/EmptyState.vue";

export default {
    name: 'PreferencesComponent',
    components: {EmptyState, AlertComponent},
    data() {
        return {
            preferences: {},
            loading: false,
            showAlert: false,
            searchTerm: '',
            alert: {
                type: "",
                message: "",
                show: false
            }
        }
    },
    computed: {
        TextConstants() {
            return TextConstants
        },
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
        },
    },
    methods: {
        getImageSource,
        fetchData() {
            this.loading = true
            axios.get(URLConstants.PREFERENCES_URL)
                .then(response => {
                    this.loading = false
                    this.preferences = response.data
                }).catch(error => {
                this.loading = false
                this.alert = getAlertObject("danger", error, true)
            })
        },
        save() {
            axios.post(URLConstants.PREFERENCES_URL, "data=" + JSON.stringify(this.preferences)).then(response => {
                if (response.status === 200) {
                    this.alert = getAlertObject("success", response.data.message, true)
                }
            }).catch(error => {
                this.alert = getAlertObject("danger", error, true)
            })
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