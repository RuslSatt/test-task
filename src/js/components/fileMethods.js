import hljs from 'highlight.js'
import { activeFolder, SIDEBAR, TAB } from '../index'
import { common } from './common'

const CONTENT = document.querySelector('code')
const UPLOAD = document.querySelector('#input_file')
const DOWNLOAD = document.querySelector('#download__file')

export const fileMethods = {
    uploadFile(event) {
        if (event.target.files.length) {
            const fileInfo = {
                name: '',
                value: '',
                url: '',
                description: '',
            }

            const file = event.target.files[0]
            const fileName = file.name

            const reader = new FileReader()
            const readerUrl = new FileReader()

            const getUrl = new Promise((resolve) => {
                readerUrl.onload = () => {
                    const url = readerUrl.result
                    resolve(url)
                }
            })
            const getContent = new Promise((resolve) => {
                reader.onload = () => {
                    const value = reader.result
                    fileMethods.addFile(fileName, value)
                    resolve(value)
                }
            })

            Promise.all([getUrl, getContent]).then((data) => {
                fileInfo.name = fileName
                fileInfo.value = data[1]
                fileInfo.url = data[0]
                localStorage.setItem(`${fileName}`, JSON.stringify(fileInfo))
            })

            readerUrl.readAsDataURL(file)
            reader.readAsText(file)
        }
    },

    addFile(nameFile, value) {
        let file = document.createElement('div')
        file.className = 'file active'
        file.style.display = 'block'

        let fileName = document.createElement('span')
        fileName.className = 'file__name'
        fileName.innerText = nameFile
        fileName.style.paddingLeft = '17px'

        this.getFilesFromTab().forEach((tab) => {
            tab.classList.remove('active')
        })

        let isHave = false
        let paddingLeft = null

        common.getFolders().forEach((folder) => {
            if (folder === activeFolder) {
                const folderArrow = folder.querySelector('.folder__arrow')
                const folderName = folder.querySelector('.folder__name')

                folderArrow.classList.add('active_arrow')
                paddingLeft = folderName.style.paddingLeft
                fileName.style.paddingLeft = paddingLeft
            }
        })

        file.append(fileName)

        const appendFile = () => {
            activeFolder ? activeFolder.append(file) : SIDEBAR.append(file)
            TAB.append(this.addTab(nameFile))
            CONTENT.innerHTML = value
        }

        if (!common.getFiles().length) {
            appendFile()
        } else {
            common.getFiles().forEach((files) => {
                if (files.innerText === nameFile) {
                    isHave = true
                }
            })
            if (!isHave) {
                appendFile()
            }
        }
        hljs.highlightAll()
    },

    addTab(nameFile) {
        let tab = document.createElement('li')
        tab.className = 'tabs__tab active'
        tab.innerText = nameFile

        let tabCross = document.createElement('span')
        tabCross.className = 'tabs__cross'

        tab.append(tabCross)
        return tab
    },

    getFilesFromTab() {
        return document.querySelectorAll('.tabs__tab')
    },

    downloadFile() {
        common.getFiles().forEach((file) => {
            if (file.classList.contains('active')) {
                const item = localStorage.getItem(`${file.innerText}`)
                const value = JSON.parse(item)
                DOWNLOAD.href = value.url
                DOWNLOAD.download = value.name
            }
        })
    },

    openFile(file) {
        let isHaveFile = false
        const fileName = file.innerText

        file.classList.add('active')

        const item = localStorage.getItem(`${fileName}`)
        const value = JSON.parse(item)

        if (value) CONTENT.innerHTML = value.value

        this.getFilesFromTab().forEach((tab) => {
            if (fileName === tab.innerText) {
                isHaveFile = true
            }
        })
        if (!isHaveFile) TAB.append(this.addTab(fileName))

        hljs.highlightAll()
    },

    updateContent() {
        if (this.getFilesFromTab().length) {
            this.getFilesFromTab().forEach((tab, index) => {
                if (index < 1) {
                    tab.classList.add('active')

                    const item = localStorage.getItem(`${tab.innerText}`)
                    const value = JSON.parse(item)
                    if (value) CONTENT.innerHTML = value.value
                    hljs.highlightAll()
                } else {
                    tab.classList.remove('active')
                }
            })
        }
    },

    closeFile(parent) {
        if (parent.classList.contains('active')) {
            parent.remove()
            CONTENT.innerText = ''
            this.updateContent()
        }
    },

    removeFile() {
        common.getFiles().forEach((file) => {
            if (file.classList.contains('active')) {
                const fileName = file.innerText

                localStorage.removeItem(fileName)
                file.remove()
                CONTENT.innerText = ''

                this.getFilesFromTab().forEach((tab) => {
                    if (fileName === tab.innerText) {
                        tab.remove()
                    }
                })
                this.updateContent()
            }
        })
    },

    renameFile(input) {
        const files = Array.from(files.getFiles())
        const filterFile = files.filter(
            (name) => name.innerText === input.value
        )
        if (!filterFile.length)
            files.getFiles().forEach((file) => {
                if (file.classList.contains('active')) {
                    if (input.value.length > 0) {
                        const fileName = file.innerText
                        const fileChildName = file.querySelector('.file__name')

                        const item = localStorage.getItem(fileName)
                        const value = JSON.parse(item)
                        value.name = input.value
                        localStorage.setItem(value.name, JSON.stringify(value))
                        localStorage.removeItem(fileName)

                        files.getFilesFromTab().forEach((tab) => {
                            if (tab.innerText === fileName) {
                                tab.firstChild.nodeValue = input.value
                            }
                        })

                        fileChildName.innerText = input.value
                        file.classList.remove('active')
                    }
                }
            })
    },
}

UPLOAD.addEventListener('change', fileMethods.uploadFile)
DOWNLOAD.addEventListener('click', fileMethods.downloadFile)

export { UPLOAD, DOWNLOAD }
