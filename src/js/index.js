import '../index.html'
import '../styles/main.scss'

const WRAPPER = document.querySelector('.wrapper')
const MAIN = document.querySelector('.main__content')
const BUTTONS = document.querySelector('.header__list')
const SIDEBAR = document.querySelector('.sidebar')
const TAB = document.querySelector('.tabs')
const INPUT_FILE = document.querySelector('#input_file')
const LINK_FILE = document.querySelector('#download__file')

WRAPPER.addEventListener('click', (e) => {
    const input = document.querySelector('.popup__input')
    const popup = document.querySelector('.popup')
    const target = e.target
    if (
        !target.closest('.popup__wrapper') &&
        !target.closest('.header__button') &&
        !target.closest('.folder') &&
        !target.closest('.file')
    ) {
        if (getFolders().length) {
            getFolders().forEach((elem) => {
                elem.classList.remove('active')
            })
        }
        if (getFiles().length) {
            getFiles().forEach((elem) => {
                elem.classList.remove('active')
            })
        }
        removePopup(popup)
    } else if (target.closest('.popup__button')) {
        let isActive = false
        let folderActive
        getFolders().forEach((folder) => {
            if (folder.classList.contains('active')) {
                isActive = true
                folderActive = folder
            }
        })
        target.innerText === 'Создать' && isActive
            ? createFolder(input, folderActive)
            : target.innerText === 'Создать' && !isActive
            ? createFolder(input)
            : renameFolder(input)
        removePopup(popup)
    }
})

const clickButton = (e) => {
    let titlePopup, nameBtn
    const button = e.target.dataset.func
    if (button === 'createFolder') {
        titlePopup = 'Введите название папки'
        nameBtn = 'Создать'
        createPopup(titlePopup, nameBtn)
    } else if (button === 'removeFolder') {
        removeFolder()
    } else if (button === 'rename') {
        getFolders().forEach((elem) => {
            if (elem.classList.contains('active')) {
                titlePopup = 'Переименуйте дерикторию'
                nameBtn = 'Переименовать'
                createPopup(titlePopup, nameBtn)
            }
        })
    } else if (button === 'uploadFile') {
        INPUT_FILE.click()
    } else if (button === 'downloadFile') {
        LINK_FILE.click()
    } else if (button === 'removeFile') {
        removeFile()
    }
}

BUTTONS.addEventListener('click', clickButton)

SIDEBAR.addEventListener('click', (e) => {
    const target = e.target
    target.classList.add('active')
    if (getFolders() && getArrows() && getFiles() !== undefined) {
        getFolders().forEach((folder) => {
            if (folder !== target) {
                folder.classList.remove('active')
            }
        })
        getArrows().forEach((arrow) => {
            if (arrow !== target) {
                arrow.classList.remove('active')
            }
        })
        getFiles().forEach((file) => {
            if (file !== target) {
                file.classList.remove('active')
            }
        })
    }
    if (target.closest('.folder__arrow')) {
        const parentArrow = target.parentNode
        if (parentArrow.children.length > 1) {
            const foldersChild = parentArrow.children[1]
            foldersChild.style.display === 'none' ? openFolder() : closeFolder()
        }
    }
})

SIDEBAR.addEventListener('dblclick', (e) => {
    const target = e.target
    const childFolder = target.querySelector('.folder')
    if (childFolder !== null) {
        if (childFolder.style.display === 'block') {
            closeFolder()
        } else {
            openFolder()
        }
    }
    if (target.closest('.file')) {
        openFile(target)
        getFilesFromTab().forEach((tab) => {
            if (tab.innerText === target.innerText) {
                tab.classList.add('active')
            } else {
                tab.classList.remove('active')
            }
        })
    }
})

TAB.addEventListener('click', (e) => {
    const target = e.target
    if (getFilesFromTab() !== undefined) {
        getFilesFromTab().forEach((tab) => {
            if (tab !== target && target !== TAB) {
                tab.classList.remove('active')
            } else if (tab === target && target !== TAB) {
                openFile(target)
            }
        })
    }
})

function createPopup(titlePopup, nameBtn) {
    let popup = document.createElement('div')
    popup.className = 'popup'

    let popupWrapper = document.createElement('div')
    popupWrapper.className = 'popup__wrapper'

    let popupTitle = document.createElement('p')
    popupTitle.className = 'popup__title'
    popupTitle.innerText = `${titlePopup}`

    let popupInput = document.createElement('input')
    popupInput.className = 'popup__input'

    let popupBtn = document.createElement('button')
    popupBtn.className = 'popup__button'
    popupBtn.innerText = `${nameBtn}`

    popup.append(popupWrapper)
    popupWrapper.append(popupTitle, popupInput, popupBtn)
    WRAPPER.append(popup)
}

function removePopup(popup) {
    if (popup !== null) {
        popup.remove()
    }
}

function createFolder(input, seat) {
    let folder = document.createElement('div')
    folder.className = 'folder'
    let arrow = document.createElement('div')
    arrow.className = 'folder__arrow'
    getArrows().forEach((arrow) => {
        arrow.classList.contains('active_arrow')
            ? (folder.style.display = 'block')
            : (folder.style.display = 'none')
    })
    folder.innerText = input.value
    folder.append(arrow)
    if (input.value.length > 0) {
        if (seat === undefined) {
            folder.style.display = 'block'
            SIDEBAR.append(folder)
        } else {
            folder.className = 'folder active'
            seat.append(folder)
            openFolder()
        }
    }
}

function getFolders() {
    return document.querySelectorAll('.folder')
}

function getArrows() {
    return document.querySelectorAll('.folder__arrow')
}

function removeFolder() {
    getFolders().forEach((folder) => {
        if (folder.classList.contains('active')) {
            const foldParent = folder.parentNode
            if (foldParent.children.length < 3) {
                foldParent.children[0].classList.remove('active_arrow')
            }
            folder.remove()
        }
    })
}

function renameFolder(input) {
    getFolders().forEach((folder) => {
        if (folder.classList.contains('active')) {
            if (input.value.length > 0) {
                folder.firstChild.nodeValue = input.value
                folder.classList.remove('active')
            }
        }
    })
}

function openFolder() {
    getFolders().forEach((folder) => {
        if (
            folder.classList.contains('active') ||
            folder.children[0].classList.contains('active')
        ) {
            if (folder.children.length > 1) {
                folder.classList.remove('active')
                folder.children[0].classList.add('active_arrow')
                const foldersChild = folder.children
                const foldersArray = Array.prototype.slice.call(foldersChild)
                foldersArray.forEach((folderChild) => {
                    folderChild.style.display = 'block'
                })
            }
        }
    })
}

function closeFolder() {
    getFolders().forEach((folder) => {
        if (
            folder.classList.contains('active') ||
            folder.children[0].classList.contains('active')
        ) {
            if (folder.children.length > 1) {
                const arrowsChild = folder.querySelectorAll('.active_arrow')
                const foldersChild = folder.querySelectorAll('.folder')
                arrowsChild.forEach((arrow) => {
                    arrow.classList.remove('active_arrow')
                })
                foldersChild.forEach((folderChild) => {
                    folderChild.style.display = 'none'
                })
            }
        }
    })
}

function uploadFile(event) {
    if (event.target.files.length) {
        const fileInfo = {
            name: '',
            value: '',
            url: '',
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

INPUT_FILE.addEventListener('change', uploadFile)

function addFile(nameFile, value) {
    let file = document.createElement('div')
    file.className = 'file active'
    file.innerText = nameFile

    getFilesFromTab().forEach((tab) => {
        tab.classList.remove('active')
    })

    let tab = document.createElement('span')
    tab.className = 'tabs__tab active'
    tab.innerText = nameFile

    let isHave = false
    let isActive = false

    if (!isActive) {
        check()
    }
    function check() {
        if (!getFiles().length) {
            SIDEBAR.append(file)
            TAB.append(tab)
            MAIN.innerText = value
        } else {
            getFiles().forEach((files) => {
                if (files.innerText === nameFile) {
                    isHave = true
                }
            })
            if (!isHave) {
                SIDEBAR.append(file)
                TAB.append(tab)
                MAIN.innerText = value
            }
        }
    }
}

function getFilesFromTab() {
    return document.querySelectorAll('.tabs__tab')
}

function getFiles() {
    return document.querySelectorAll('.file')
}

function downloadFile() {
    // LINK_FILE.href = localStorage.getItem('url')
}

LINK_FILE.addEventListener('click', downloadFile)

function openFile(file) {
    file.classList.add('active')
    const nameFile = file.innerText
    const item = localStorage.getItem(`${nameFile}`)
    const value = JSON.parse(item)
    MAIN.innerText = value.value
}

function removeFile() {
    getFiles().forEach((file) => {
        if (file.classList.contains('active')) {
            const name = file.innerText
            localStorage.removeItem(name)
            file.remove()
            MAIN.innerText = ''
            getFilesFromTab().forEach((tab) => {
                if (name === tab.innerText) {
                    tab.remove()
                }
            })
        }
    })
}

window.addEventListener('pageshow', () => {
    localStorage.clear()
})
