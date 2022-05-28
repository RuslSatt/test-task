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
    closeFolder,
    createFolder,
    getArrows,
    getFolders,
    openFolder,
    removeFolder,
    renameFolder,
} from './components/folders'
import { createPopup, removePopup } from './components/popup'

export const WRAPPER = document.querySelector('.wrapper')
export const CONTENT = document.querySelector('code')
export const BUTTONS = document.querySelector('.header__list')
export const SIDEBAR = document.querySelector('.sidebar')
export const TAB = document.querySelector('.tabs')
// Используется при добавлении файла внутрь каталога
export let activeFolder = null

const clickOnButton = (e) => {
    let titlePopup, nameBtn
    const button = e.target.dataset.func
    if (getDescription()) getDescription().remove()
    if (button === 'createFolder') {
        titlePopup = 'Введите название папки'
        nameBtn = 'Создать'
        createPopup(titlePopup, nameBtn)
    } else if (button === 'removeFolder') {
        removeFolder()
    } else if (button === 'rename') {
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
    } else if (button === 'uploadFile') {
        activeFolder = null
        getFolders().forEach((folder) => {
            if (folder.classList.contains('active')) {
                activeFolder = folder
            }
        })
        INPUT.click()
    } else if (button === 'downloadFile') {
        if (LINK.href !== '') LINK.click()
    } else if (button === 'removeFile') {
        removeFile()
    }
}

BUTTONS.addEventListener('click', clickOnButton)

const clickOutsideAndUsePopup = (e) => {
    const input = document.querySelector('.popup__input')
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
        if (getDescription()) getDescription().remove()
        removePopup(popup)
    } else if (target.closest('.popup__button')) {
        if (getFolders().length) {
            getFolders().forEach((folder, index) => {
                if (folder.classList.contains('active')) {
                    if (target.innerText === 'Создать') {
                        createFolder(input, folder)
                    } else {
                        renameFolder(input)
                    }
                } else if (
                    index === getFolders().length - 1 &&
                    target.innerText === 'Создать'
                ) {
                    createFolder(input)
                }
            })
        } else if (target.innerText === 'Создать') {
            createFolder(input)
        }

        getFiles().forEach((file) => {
            if (
                file.classList.contains('active') &&
                target.innerText !== 'Создать'
            )
                renameFile(input)
        })

        removePopup(popup)
    }
    if (target.closest('.description__edit')) {
        if (target.innerText === 'Редактировать') {
            editDescription()
        } else {
            saveDescription()
        }
    }
}

WRAPPER.addEventListener('click', clickOutsideAndUsePopup)

const clickOnBarAndArrow = (e) => {
    const target = e.target
    target.classList.add('active')
    if (getFolders() && getArrows() && getFiles()) {
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
        if (getDescription()) getDescription().remove()
    }
    if (target.closest('.folder__arrow')) {
        const parentArrow = target.parentNode
        if (parentArrow.children.length > 1) {
            const foldersChild = parentArrow.children[1]
            foldersChild.style.display === 'none' ? openFolder() : closeFolder()
        }
    }
}

SIDEBAR.addEventListener('click', clickOnBarAndArrow)
SIDEBAR.addEventListener('contextmenu', showDescription)

const dbClickOnFoldersAndFiles = (e) => {
    const target = e.target
    const folderChild = target.querySelector('.folder')
    const fileChild = target.querySelector('.file')
    if (folderChild !== null) {
        if (folderChild.style.display === 'block') {
            closeFolder()
        } else {
            openFolder()
        }
    } else if (fileChild !== null) {
        if (fileChild.style.display === 'block') {
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
}

SIDEBAR.addEventListener('dblclick', dbClickOnFoldersAndFiles)

const clickOnTabs = (e) => {
    const target = e.target
    if (getFilesFromTab()) {
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
