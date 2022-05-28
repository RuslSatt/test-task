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
        const nameFile = file.name

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
                addFile(nameFile, value)
                resolve(value)
            }
        })

        Promise.all([getUrl, getContent]).then((data) => {
            fileInfo.name = nameFile
            fileInfo.value = data[1]
            fileInfo.url = data[0]
            localStorage.setItem(`${nameFile}`, JSON.stringify(fileInfo))
        })

        readerUrl.readAsDataURL(file)
        reader.readAsText(file)
    }
}

INPUT.addEventListener('change', uploadFile)

function addFile(nameFile, value) {
    let file = document.createElement('div')
    file.className = 'file active'
    file.innerText = nameFile
    file.style.display = 'block'

    getFilesFromTab().forEach((tab) => {
        tab.classList.remove('active')
    })

    let isHave = false

    getFolders().forEach((folder) => {
        if (folder === activeFolder) {
            folder.children[0].classList.add('active_arrow')
        }
    })

    const appendFile = () => {
        activeFolder ? activeFolder.append(file) : SIDEBAR.append(file)
        TAB.append(addTab(nameFile))
        CONTENT.innerHTML = value
        hljs.highlightAll()
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
}

function addTab(nameFile) {
    let tab = document.createElement('span')
    tab.className = 'tabs__tab active'
    tab.innerText = nameFile

    let cross = document.createElement('span')
    cross.className = 'tabs__cross'

    tab.append(cross)
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
    file.classList.add('active')
    const nameFile = file.innerText
    const item = localStorage.getItem(`${nameFile}`)
    const value = JSON.parse(item)
    if (value) CONTENT.innerHTML = value.value
    hljs.highlightAll()
    let isHaveFile = false
    getFilesFromTab().forEach((tab, index) => {
        if (nameFile === tab.innerText) {
            isHaveFile = true
        }
    })
    if (!isHaveFile) TAB.append(addTab(nameFile))
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
            const name = file.innerText
            localStorage.removeItem(name)
            file.remove()
            CONTENT.innerText = ''
            getFilesFromTab().forEach((tab) => {
                if (name === tab.innerText) {
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
                    const item = localStorage.getItem(`${file.innerText}`)
                    const value = JSON.parse(item)
                    localStorage.removeItem(`${file.innerText}`)
                    value.name = input.value
                    localStorage.setItem(value.name, JSON.stringify(value))
                    getFilesFromTab().forEach((tab) => {
                        if (tab.innerText === file.innerText) {
                            tab.firstChild.nodeValue = input.value
                        }
                    })
                    file.firstChild.nodeValue = input.value
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
