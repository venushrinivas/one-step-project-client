export const serverPath = process.env.VUE_APP_SERVER_URL

export function showAlertMessage(type, message, ref) {
    if (type === "success") {
        ref.classList.remove("alert-danger")
        ref.classList.add("alert-success")
    } else {
        ref.classList.add("alert-danger")
        ref.classList.remove("alert-success")
    }
    ref.classList.remove("d-none")
    ref.innerText = message;
    setTimeout(() => {
        ref.classList.add("d-none")
    }, 2000);
}

export function getImageSource(imagePath) {
    if (imagePath.indexOf("http") !== -1) return imagePath
    else return serverPath + imagePath
}