export const common = {
    getFolders() {
        return document.querySelectorAll('.folder')
    },

    getFiles() {
        return document.querySelectorAll('.file')
    },

    getFilesFromTab() {
        return document.querySelectorAll('.tabs__tab')
    },

    getDescription() {
        return document.querySelector('.description')
    },
}
