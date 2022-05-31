import '../index.html'
import '../styles/main.scss'
import 'highlight.js/styles/github.css'

import {
    fileMethods,
    INPUT_FILE,
    LINK_DOWNLOAD,
} from './components/fileMethods'
import { folderMethods } from './components/folderMethods'
import { common } from './components/common'
import { descriptionMethods } from './components/descriptionMethods'
import { popupMethods } from './components/popupMethods'

const WRAPPER = document.querySelector('.wrapper')
const BUTTONS = document.querySelector('.header__list')
const SIDEBAR = document.querySelector('.sidebar')
const TAB = document.querySelector('.tabs ul')
// Используется для создания папок и при добавлении файла внутрь каталога
let activeFolder = null

const clickOnButton = (e) => {
    let titlePopup, nameBtn
    const button = e.target.dataset.func

    if (common.getDescription()) {
        common.getDescription().remove()
    }

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
            common.getFolders().forEach((folder) => {
                if (folder.classList.contains('active')) {
                    titlePopup = 'Переименуйте дерикторию'
                    nameBtn = 'Переименовать'
                    popupMethods.createPopup(titlePopup, nameBtn)
                }
            })
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
            INPUT_FILE.value = ''
            common.getFolders().forEach((folder) => {
                if (folder.classList.contains('active')) {
                    activeFolder = folder
                }
            })
            INPUT_FILE.click()
            break
        }
        case 'downloadFile': {
            common.getFiles().forEach((file) => {
                if (file.classList.contains('active')) {
                    LINK_DOWNLOAD.click()
                }
            })
            break
        }
        case 'removeFile': {
            fileMethods.removeFile()
            break
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
        common.getFolders().forEach((folder) => {
            if (folder.classList.contains('active')) {
                folder.classList.remove('active')
            }
        })

        common.getFiles().forEach((file) => {
            if (file.classList.contains('active')) {
                file.classList.remove('active')
            }
        })

        if (common.getDescription()) {
            common.getDescription().remove()
        }

        popupMethods.removePopup(popup)
    } else if (target.closest('.popup__button')) {
        activeFolder = null

        common.getFolders().forEach((folder) => {
            if (folder.classList.contains('active')) {
                activeFolder = folder
            }
        })

        if (activeFolder) {
            if (target.innerText === 'Создать') {
                folderMethods.createFolder(popupInput, activeFolder)
            } else {
                folderMethods.renameFolder(popupInput)
            }
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

    common.getFolders().forEach((folder) => {
        if (folder !== target && folder.classList.contains('active')) {
            folder.classList.remove('active')
        }
    })

    common.getFiles().forEach((file) => {
        if (file !== target && file.classList.contains('active')) {
            file.classList.remove('active')
        }
    })

    if (common.getDescription()) {
        common.getDescription().remove()
    }

    if (target.closest('.folder__arrow')) {
        const folder = target.parentNode
        folder.classList.add('active')

        folderMethods.callOpenOrCloseFolder(folder)
    }

    if (target.closest('.folder__name') || target.closest('.file__name')) {
        const parent = target.parentNode
        parent.classList.add('active')
    }
}

const dbClickOnFoldersAndFiles = (e) => {
    const target = e.target

    folderMethods.callOpenOrCloseFolder(target)

    if (target.closest('.file')) {
        fileMethods.openFile(target)
        common.getFilesFromTab().forEach((tab) => {
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
    if (common.getFilesFromTab().length) {
        common.getFilesFromTab().forEach((tab) => {
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
        const tab = target.parentNode
        tab.classList.add('active')
        fileMethods.closeFile(tab)
    }
}

TAB.addEventListener('click', clickOnTabs)

window.addEventListener('unload', () => {
    const tree = SIDEBAR.innerHTML
    localStorage.setItem('page', tree)
})

window.addEventListener('pageshow', () => {
    SIDEBAR.innerHTML = localStorage.getItem('page')
})

export { WRAPPER, BUTTONS, SIDEBAR, TAB, activeFolder }
