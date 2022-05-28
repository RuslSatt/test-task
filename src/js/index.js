import '../index.html'
import '../styles/main.scss'
import 'highlight.js/styles/github.css'
import {
    editDescription,
    getDescription,
    saveDescription,
    showDescription,
} from './components/description'
import {
    closeFile,
    getFiles,
    getFilesFromTab,
    INPUT,
    LINK,
    openFile,
    removeFile,
    renameFile,
} from './components/files'
import {
    callOpenOrCloseFolder,
    createFolder,
    getFolders,
    removeFolder,
    renameFolder,
} from './components/folders'
import { createPopup, removePopup } from './components/popup'

export const WRAPPER = document.querySelector('.wrapper')
export const CONTENT = document.querySelector('code')
export const BUTTONS = document.querySelector('.header__list')
export const SIDEBAR = document.querySelector('.sidebar')
export const TAB = document.querySelector('.tabs ul')
// Используется при добавлении файла внутрь каталога
export let activeFolder = null

const clickOnButton = (e) => {
    let titlePopup, nameBtn
    const button = e.target.dataset.func

    switch (button) {
        case 'createFolder': {
            titlePopup = 'Введите название папки'
            nameBtn = 'Создать'
            createPopup(titlePopup, nameBtn)
            break
        }
        case 'removeFolder': {
            removeFolder()
            break
        }
        case 'rename': {
            if (getFolders().length)
                getFolders().forEach((folder) => {
                    if (folder.classList.contains('active')) {
                        titlePopup = 'Переименуйте дерикторию'
                        nameBtn = 'Переименовать'
                        createPopup(titlePopup, nameBtn)
                    }
                })
            if (getFiles().length)
                getFiles().forEach((file) => {
                    if (file.classList.contains('active')) {
                        titlePopup = 'Переименуйте файл'
                        nameBtn = 'Переименовать'
                        createPopup(titlePopup, nameBtn)
                    }
                })
            break
        }
        case 'uploadFile': {
            activeFolder = null
            getFolders().forEach((folder) => {
                if (folder.classList.contains('active')) {
                    activeFolder = folder
                }
            })
            INPUT.click()
            break
        }
        case 'downloadFile': {
            if (getFiles().length) {
                getFiles().forEach((file) => {
                    if (file.classList.contains('active')) {
                        LINK.click()
                    }
                })
            }
            break
        }
        case 'removeFile': {
            removeFile()
            break
        }
        default: {
            if (getDescription()) {
                getDescription().remove()
            }
        }
    }
}

BUTTONS.addEventListener('click', clickOnButton)

const clickOutsideAndUsePopup = (e) => {
    const popupInput = document.querySelector('.popup__input')
    const popup = document.querySelector('.popup')
    const target = e.target
    if (
        !target.closest('.popup__wrapper') &&
        !target.closest('.header__button') &&
        !target.closest('.folder') &&
        !target.closest('.file') &&
        !target.closest('.description')
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
        if (getDescription()) {
            getDescription().remove()
        }
        removePopup(popup)
    } else if (target.closest('.popup__button')) {
        if (getFolders().length) {
            getFolders().forEach((folder, index) => {
                if (folder.classList.contains('active')) {
                    if (target.innerText === 'Создать') {
                        createFolder(popupInput, folder)
                    } else {
                        renameFolder(popupInput)
                    }
                } else if (
                    index === getFolders().length - 1 &&
                    target.innerText === 'Создать'
                ) {
                    createFolder(popupInput)
                }
            })
        } else if (target.innerText === 'Создать') {
            createFolder(popupInput)
        }

        getFiles().forEach((file) => {
            if (
                file.classList.contains('active') &&
                target.innerText !== 'Создать'
            )
                renameFile(popupInput)
        })

        removePopup(popup)
    }
    if (target.closest('.description__edit')) {
        if (!target.classList.contains('edit')) {
            editDescription()
        } else {
            saveDescription()
        }
    }
}

WRAPPER.addEventListener('click', clickOutsideAndUsePopup)

const clickOnSideBar = (e) => {
    const target = e.target
    if (target.closest('.folder') || target.closest('.file')) {
        target.classList.add('active')
    }

    if (getFolders().length) {
        getFolders().forEach((folder) => {
            if (folder !== target) {
                folder.classList.remove('active')
            }
        })
    }

    if (getFiles().length) {
        getFiles().forEach((file) => {
            if (file !== target) {
                file.classList.remove('active')
            }
        })
    }

    if (getDescription()) getDescription().remove()

    if (target.closest('.folder__arrow')) {
        const folder = target.parentNode
        folder.classList.add('active')

        callOpenOrCloseFolder(folder)
    }
    if (target.closest('.folder__name')) {
        const folder = target.parentNode
        folder.classList.add('active')
    }
}

const dbClickOnFoldersAndFiles = (e) => {
    const target = e.target

    callOpenOrCloseFolder(target)

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
}

SIDEBAR.addEventListener('click', clickOnSideBar)
SIDEBAR.addEventListener('contextmenu', showDescription)
SIDEBAR.addEventListener('dblclick', dbClickOnFoldersAndFiles)

const clickOnTabs = (e) => {
    const target = e.target
    if (getFilesFromTab().length) {
        getFilesFromTab().forEach((tab) => {
            if (
                target !== tab &&
                target !== TAB &&
                !target.closest('.tabs__cross')
            ) {
                tab.classList.remove('active')
            } else if (tab === target && target !== TAB) {
                openFile(target)
            }
        })
    }
    if (target.closest('.tabs__cross')) {
        const parent = target.parentNode
        parent.classList.add('active')
        closeFile(parent)
    }
}

TAB.addEventListener('click', clickOnTabs)

window.addEventListener('pageshow', () => {
    localStorage.clear()
})
