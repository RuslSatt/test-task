import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import { activeFolder, SIDEBAR, TAB } from '../index'
import { common } from './common'

const CONTENT = document.querySelector('code')
const INPUT_FILE = document.querySelector('#input_file')
const LINK_DOWNLOAD = document.querySelector('#download__file')
hljs.registerLanguage('javascript', javascript)

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
                    resolve(value)
                }
            })

            Promise.all([getUrl, getContent]).then((data) => {
                fileInfo.name = fileName
                fileInfo.value = data[1]
                fileInfo.url = data[0]
                localStorage.setItem(`${fileName}`, JSON.stringify(fileInfo))
                fileMethods.addFile(fileName, data[1])
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

        let isHave = false
        let paddingLeft = null
        let arrow = null

        common.getFolders().forEach((folder) => {
            if (folder === activeFolder) {
                arrow = folder.querySelector('.folder__arrow')
                const folderName = folder.querySelector('.folder__name')

                paddingLeft = folderName.style.paddingLeft
                fileName.style.paddingLeft = parseInt(paddingLeft) + 17 + 'px'
            }
        })

        file.append(fileName)

        const appendFile = () => {
            if (activeFolder) {
                activeFolder.append(file)
                const folderChildren = activeFolder.children
                let children = Array.prototype.slice.call(folderChildren)

                children.forEach((child) => {
                    child.style.display = 'block'
                })
            } else {
                SIDEBAR.append(file)
            }
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
                if (arrow) arrow.classList.add('active_arrow')

                common.getFilesFromTab().forEach((tab) => {
                    if (tab.classList.contains('active')) {
                        tab.classList.remove('active')
                    }
                })

                appendFile()
            } else {
                if (arrow) arrow.classList.remove('active_arrow')
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

    downloadFile() {
        common.getFiles().forEach((file) => {
            if (file.classList.contains('active')) {
                const item = localStorage.getItem(`${file.innerText}`)
                const data = JSON.parse(item)
                LINK_DOWNLOAD.href = data.url
                LINK_DOWNLOAD.download = data.name
            }
        })
    },

    openFile(file) {
        let isHaveFile = false
        const fileName = file.innerText

        file.classList.add('active')

        const item = localStorage.getItem(`${fileName}`)
        const data = JSON.parse(item)

        if (data) CONTENT.innerHTML = data.value

        common.getFilesFromTab().forEach((tab) => {
            if (fileName === tab.innerText) {
                isHaveFile = true
            }
        })
        if (!isHaveFile) TAB.append(this.addTab(fileName))

        hljs.highlightAll()
    },

    updateContent() {
        if (common.getFilesFromTab().length) {
            common.getFilesFromTab().forEach((tab, index) => {
                if (index < 1) {
                    tab.classList.add('active')

                    const item = localStorage.getItem(`${tab.innerText}`)
                    const data = JSON.parse(item)
                    if (data) CONTENT.innerHTML = data.value
                    hljs.highlightAll()
                } else {
                    tab.classList.remove('active')
                }
            })
        }
    },

    closeFile(tab) {
        if (tab.classList.contains('active')) {
            tab.remove()
            CONTENT.innerHTML = ''
            this.updateContent()
        }
    },

    removeFile() {
        common.getFiles().forEach((file) => {
            if (file.classList.contains('active')) {
                const fileName = file.innerText

                const folder = file.parentNode
                const folderArrow = folder.querySelector('.folder__arrow')

                file.remove()

                const fileChild = folder.querySelector('.file')
                const folderChild = folder.querySelector('.folder')

                if (!fileChild && !folderChild && folderArrow) {
                    folderArrow.classList.remove('active_arrow')
                }

                localStorage.removeItem(fileName)

                CONTENT.innerHTML = ''

                common.getFilesFromTab().forEach((tab) => {
                    if (fileName === tab.innerText) {
                        tab.remove()
                    }
                })

                this.updateContent()
            }
        })
    },

    renameFile(input) {
        const files = Array.from(common.getFiles())
        const filterFile = files.filter(
            (name) => name.innerText === input.value
        )
        if (!filterFile.length)
            common.getFiles().forEach((file) => {
                if (file.classList.contains('active')) {
                    if (input.value.length > 0) {
                        const fileName = file.innerText
                        const fileChildName = file.querySelector('.file__name')

                        const item = localStorage.getItem(fileName)
                        const data = JSON.parse(item)

                        const valueName = input.value.split(' ').join('')

                        data.name = valueName
                        localStorage.setItem(data.name, JSON.stringify(data))
                        localStorage.removeItem(fileName)

                        common.getFilesFromTab().forEach((tab) => {
                            if (tab.innerText === fileName) {
                                tab.firstChild.nodeValue = valueName
                            }
                        })

                        fileChildName.innerText = valueName
                        file.classList.remove('active')
                    }
                }
            })
    },
}

INPUT_FILE.addEventListener('change', fileMethods.uploadFile)
LINK_DOWNLOAD.addEventListener('click', fileMethods.downloadFile)

export { INPUT_FILE, LINK_DOWNLOAD, CONTENT }
