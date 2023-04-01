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