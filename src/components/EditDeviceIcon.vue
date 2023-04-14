<template>
    <td class="device-icon" v-if="!editing">
        <img :src="getImageSource(device.image)" :alt="device.image">
        <button @click="setEditMode()">{{ TextConstants.EDIT }}</button>
    </td>
    <td class="device-icon" v-else>
        <input type="file" ref="fileInput" @change="handleFileUpload(device)"/>
        <button @click.prevent="saveFile(device)">{{ TextConstants.SAVE }}</button>
    </td>
</template>

<script>
import TextConstants from "../constants/TextConstants";
import {getImageSource} from "@/util/commons";
import axios from "axios";
import URLConstants from "@/constants/URLConstants";

export default {
    name: "EditDeviceIcon",
    methods: {
        getImageSource,
        setEditMode() {
            this.editing = true
        },
        handleFileUpload() {
            if (this.$refs.fileInput.files && this.$refs.fileInput.files.length > 0) {
                this.file = this.$refs.fileInput.files[0]
            }
        },
        async saveFile(device) {
            if (this.file) {
                const formData = new FormData()
                formData.append('file', this.file)
                let response = await axios.post(URLConstants.UPLOAD_URL + device.device_id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (response.status === 200) {
                    device.image = response.data.message
                }
            }
            this.file = undefined
            this.editing = false
        }
    },
    computed: {
        TextConstants() {
            return TextConstants
        }
    },
    props: {
        device: {
            type: Object
        }
    },
    data() {
        return {
            editing: false,
            file: undefined
        }
    },
}
</script>

<style scoped>
.device-icon {
    width: 25%;
}
.device-icon img {
    width: 20px;
}
</style>