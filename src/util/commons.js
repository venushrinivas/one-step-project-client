export const serverPath = process.env.VUE_APP_SERVER_URL

export function getAlertObject(type, message, show) {
    return {
        type: type,
        message: message,
        show: show
    }
}

export function getImageSource(imagePath) {
    if (imagePath.indexOf("http") !== -1) return imagePath
    else return serverPath + imagePath
}