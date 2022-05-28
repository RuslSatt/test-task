import hljs from 'highlight.js'
import { activeFolder, CONTENT, SIDEBAR, TAB } from '../index'
import { getFolders } from './folders'

export const INPUT = document.querySelector('#input_file')
export const LINK = document.querySelector('#download__file')

function uploadFile(event) {
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
                addFile(fileName, value)
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
}

INPUT.addEventListener('change', uploadFile)

function addFile(nameFile, value) {
    let file = document.createElement('div')
    file.className = 'file active'
    file.style.display = 'block'

    let fileName = document.createElement('span')
    fileName.className = 'file__name'
    fileName.innerText = nameFile
    fileName.style.paddingLeft = '17px'

    getFilesFromTab().forEach((tab) => {
        tab.classList.remove('active')
    })

    let isHave = false
    let paddingLeft = null

    getFolders().forEach((folder) => {
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
        TAB.append(addTab(nameFile))
        CONTENT.innerHTML = value
    }

    if (!getFiles().length) {
        appendFile()
    } else {
        getFiles().forEach((files) => {
            if (files.innerText === nameFile) {
                isHave = true
            }
        })
        if (!isHave) {
            appendFile()
        }
    }

    hljs.highlightAll()
}

function addTab(nameFile) {
    let tab = document.createElement('li')
    tab.className = 'tabs__tab active'
    tab.innerText = nameFile

    let tabCross = document.createElement('span')
    tabCross.className = 'tabs__cross'

    tab.append(tabCross)
    return tab
}

function getFilesFromTab() {
    return document.querySelectorAll('.tabs__tab')
}

function getFiles() {
    return document.querySelectorAll('.file')
}

function downloadFile() {
    getFiles().forEach((file) => {
        if (file.classList.contains('active')) {
            const item = localStorage.getItem(`${file.innerText}`)
            const value = JSON.parse(item)
            LINK.href = value.url
            LINK.download = value.name
        }
    })
}

LINK.addEventListener('click', downloadFile)

function openFile(file) {
    let isHaveFile = false
    const fileName = file.innerText

    file.classList.add('active')

    const item = localStorage.getItem(`${fileName}`)
    const value = JSON.parse(item)

    if (value) CONTENT.innerHTML = value.value

    getFilesFromTab().forEach((tab, index) => {
        if (fileName === tab.innerText) {
            isHaveFile = true
        }
    })
    if (!isHaveFile) TAB.append(addTab(fileName))

    hljs.highlightAll()
}

function updateContent() {
    if (getFilesFromTab().length) {
        getFilesFromTab().forEach((tab, index) => {
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
}

function closeFile(parent) {
    if (parent.classList.contains('active')) {
        parent.remove()
        CONTENT.innerText = ''
        updateContent()
    }
}

function removeFile() {
    getFiles().forEach((file) => {
        if (file.classList.contains('active')) {
            const fileName = file.innerText

            localStorage.removeItem(fileName)
            file.remove()
            CONTENT.innerText = ''

            getFilesFromTab().forEach((tab) => {
                if (fileName === tab.innerText) {
                    tab.remove()
                }
            })
            updateContent()
        }
    })
}

function renameFile(input) {
    const files = Array.from(getFiles())
    const filterFile = files.filter((name) => name.innerText === input.value)
    if (!filterFile.length)
        getFiles().forEach((file) => {
            if (file.classList.contains('active')) {
                if (input.value.length > 0) {
                    const fileName = file.innerText
                    const fileChildName = file.querySelector('.file__name')

                    const item = localStorage.getItem(fileName)
                    const value = JSON.parse(item)
                    value.name = input.value
                    localStorage.setItem(value.name, JSON.stringify(value))
                    localStorage.removeItem(fileName)

                    getFilesFromTab().forEach((tab) => {
                        if (tab.innerText === fileName) {
                            tab.firstChild.nodeValue = input.value
                        }
                    })

                    fileChildName.innerText = input.value
                    file.classList.remove('active')
                }
            }
        })
}

export {
    uploadFile,
    addFile,
    addTab,
    getFiles,
    closeFile,
    downloadFile,
    getFilesFromTab,
    renameFile,
    removeFile,
    openFile,
}
