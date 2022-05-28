import '../index.html'
import '../styles/main.scss'
import 'highlight.js/styles/github.css'

import { DOWNLOAD, fileMethods, UPLOAD } from './components/fileMethods'
import { folderMethods } from './components/folderMethods'
import { common } from './components/common'
import { descriptionMethods } from './components/descriptionMethods'
import { popupMethods } from './components/popupMethods'

const WRAPPER = document.querySelector('.wrapper')
const BUTTONS = document.querySelector('.header__list')
const SIDEBAR = document.querySelector('.sidebar')
const TAB = document.querySelector('.tabs ul')
// Используется при добавлении файла внутрь каталога
let activeFolder = null

const clickOnButton = (e) => {
    let titlePopup, nameBtn
    const button = e.target.dataset.func

    switch (button) {
        case 'createFolder': {
            titlePopup = 'Введите название папки'
            nameBtn = 'Создать'
            popupMethods.createPopup(titlePopup, nameBtn)
            break
        }
        case 'removeFolder': {
            folderMethods.removeFolder()
            break
        }
        case 'rename': {
            if (common.getFolders().length)
                common.getFolders().forEach((folder) => {
                    if (folder.classList.contains('active')) {
                        titlePopup = 'Переименуйте дерикторию'
                        nameBtn = 'Переименовать'
                        popupMethods.createPopup(titlePopup, nameBtn)
                    }
                })
            if (common.getFiles().length)
                common.getFiles().forEach((file) => {
                    if (file.classList.contains('active')) {
                        titlePopup = 'Переименуйте файл'
                        nameBtn = 'Переименовать'
                        popupMethods.createPopup(titlePopup, nameBtn)
                    }
                })
            break
        }
        case 'uploadFile': {
            activeFolder = null
            common.getFolders().forEach((folder) => {
                if (folder.classList.contains('active')) {
                    activeFolder = folder
                }
            })
            UPLOAD.click()
            break
        }
        case 'downloadFile': {
            if (common.getFiles().length) {
                common.getFiles().forEach((file) => {
                    if (file.classList.contains('active')) {
                        DOWNLOAD.click()
                    }
                })
            }
            break
        }
        case 'removeFile': {
            fileMethods.removeFile()
            break
        }
        default: {
            if (descriptionMethods.getDescription()) {
                descriptionMethods.getDescription().remove()
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
        if (common.getFolders().length) {
            common.getFolders().forEach((elem) => {
                elem.classList.remove('active')
            })
        }
        if (common.getFiles().length) {
            common.getFiles().forEach((elem) => {
                elem.classList.remove('active')
            })
        }
        if (descriptionMethods.getDescription()) {
            descriptionMethods.getDescription().remove()
        }
        popupMethods.removePopup(popup)
    } else if (target.closest('.popup__button')) {
        if (common.getFolders().length) {
            common.getFolders().forEach((folder, index) => {
                if (folder.classList.contains('active')) {
                    if (target.innerText === 'Создать') {
                        folderMethods.createFolder(popupInput, folder)
                    } else {
                        folderMethods.renameFolder(popupInput)
                    }
                } else if (
                    index === common.getFolders().length - 1 &&
                    target.innerText === 'Создать'
                ) {
                    folderMethods.createFolder(popupInput)
                }
            })
        } else if (target.innerText === 'Создать') {
            folderMethods.createFolder(popupInput)
        }

        common.getFiles().forEach((file) => {
            if (
                file.classList.contains('active') &&
                target.innerText !== 'Создать'
            )
                fileMethods.renameFile(popupInput)
        })

        popupMethods.removePopup(popup)
    }
    if (target.closest('.description__edit')) {
        if (!target.classList.contains('edit')) {
            descriptionMethods.editDescription()
        } else {
            descriptionMethods.saveDescription()
        }
    }
}

WRAPPER.addEventListener('click', clickOutsideAndUsePopup)

const clickOnSideBar = (e) => {
    const target = e.target
    if (target.closest('.folder') || target.closest('.file')) {
        target.classList.add('active')
    }

    if (common.getFolders().length) {
        common.getFolders().forEach((folder) => {
            if (folder !== target) {
                folder.classList.remove('active')
            }
        })
    }

    if (common.getFiles().length) {
        common.getFiles().forEach((file) => {
            if (file !== target) {
                file.classList.remove('active')
            }
        })
    }

    if (descriptionMethods.getDescription()) {
        descriptionMethods.getDescription().remove()
    }

    if (target.closest('.folder__arrow')) {
        const folder = target.parentNode
        folder.classList.add('active')

        folderMethods.callOpenOrCloseFolder(folder)
    }
    if (target.closest('.folder__name')) {
        const folder = target.parentNode
        folder.classList.add('active')
    }
}

const dbClickOnFoldersAndFiles = (e) => {
    const target = e.target

    folderMethods.callOpenOrCloseFolder(target)

    if (target.closest('.file')) {
        fileMethods.openFile(target)
        fileMethods.getFilesFromTab().forEach((tab) => {
            if (tab.innerText === target.innerText) {
                tab.classList.add('active')
            } else {
                tab.classList.remove('active')
            }
        })
    }
}

SIDEBAR.addEventListener('click', clickOnSideBar)
SIDEBAR.addEventListener('contextmenu', descriptionMethods.showDescription)
SIDEBAR.addEventListener('dblclick', dbClickOnFoldersAndFiles)

const clickOnTabs = (e) => {
    const target = e.target
    if (fileMethods.getFilesFromTab().length) {
        fileMethods.getFilesFromTab().forEach((tab) => {
            if (
                target !== tab &&
                target !== TAB &&
                !target.closest('.tabs__cross')
            ) {
                tab.classList.remove('active')
            } else if (tab === target && target !== TAB) {
                fileMethods.openFile(target)
            }
        })
    }
    if (target.closest('.tabs__cross')) {
        const parent = target.parentNode
        parent.classList.add('active')
        fileMethods.closeFile(parent)
    }
}

TAB.addEventListener('click', clickOnTabs)

window.addEventListener('pageshow', () => {
    localStorage.clear()
})

export { WRAPPER, BUTTONS, SIDEBAR, TAB, activeFolder }
