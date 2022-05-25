import '../index.html'
import '../styles/main.scss'

// popup create folder //
const WRAPPER = document.querySelector('.wrapper')
const BUTTONS = document.querySelector('.header__list')
const SIDEBAR = document.querySelector('.sidebar')
let folders
let input

WRAPPER.addEventListener('click', (e) => {
    folders = document.querySelectorAll('.folder')
    const popup = document.querySelector('.popup')
    const target = e.target
    if (
        !target.closest('.popup__wrapper') &&
        !target.closest('.header__button') &&
        !target.closest('.folder')
    ) {
        folders.forEach((elem) => {
            elem.classList.remove('active')
        })
        removePopup(popup)
    } else if (target.closest('.popup__button')) {
        target.innerText === 'Создать' ? createFolder() : renameFolder()
        removePopup(popup)
    }
})

SIDEBAR.addEventListener('click', (e) => {
    const folderTarget = e.target
    if (folderTarget.closest('.folder')) {
        folderTarget.classList.add('active')
    }
})

const clickButton = (e) => {
    let titlePopup
    let nameBtn
    const button = e.target.dataset.func
    if (button === 'createFolder') {
        titlePopup = 'Введите название папки'
        nameBtn = 'Создать'
        createPopup(titlePopup, nameBtn)
    } else if (button === 'removeFolder') {
        removeFolder()
    } else if (button === 'rename') {
        titlePopup = 'Переименуйте дерикторию'
        nameBtn = 'Переименовать'
        createPopup(titlePopup, nameBtn)
    }
}

BUTTONS.addEventListener('click', clickButton)

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

    input = document.querySelector('.popup__input')
}

function removePopup(popup) {
    if (popup !== null) {
        popup.remove()
    }
}

function createFolder() {
    let folder = document.createElement('div')
    folder.className = 'folder'

    let arrow = document.createElement('div')
    arrow.className = 'folder__arrow'
    folder.innerText = input.value
    folder.append(arrow)
    if (input.value.length > 0) SIDEBAR.append(folder)
}

function removeFolder() {
    folders.forEach((fold) => {
        if (fold.classList.contains('active')) {
            fold.remove()
        }
    })
}

function renameFolder() {
    folders.forEach((fold) => {
        if (fold.classList.contains('active')) {
            if (input.value.length > 0) {
                fold.firstChild.nodeValue = input.value
                fold.classList.remove('active')
            }
        }
    })
}
