import '../index.html'
import '../styles/main.scss'

const WRAPPER = document.querySelector('.wrapper')
const BUTTONS = document.querySelector('.header__list')
const SIDEBAR = document.querySelector('.sidebar')

WRAPPER.addEventListener('click', (e) => {
    const input = document.querySelector('.popup__input')
    const popup = document.querySelector('.popup')
    const target = e.target
    if (
        !target.closest('.popup__wrapper') &&
        !target.closest('.header__button') &&
        !target.closest('.folder')
    ) {
        getFolders().forEach((elem) => {
            elem.classList.remove('active')
        })
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

SIDEBAR.addEventListener('click', (e) => {
    const target = e.target
    target.classList.add('active')
    if (getFolders() && getArrows() !== undefined) {
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
    const childFolder = e.target.querySelector('.folder')
    if (childFolder !== null) {
        if (childFolder.style.display === 'block') {
            closeFolder()
        } else {
            openFolder()
        }
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
    getFolders().forEach((fold) => {
        if (fold.classList.contains('active')) {
            const foldParent = fold.parentNode
            foldParent.children[0].classList.remove('active_arrow')
            fold.remove()
        }
    })
}

function renameFolder(input) {
    getFolders().forEach((fold) => {
        if (fold.classList.contains('active')) {
            if (input.value.length > 0) {
                fold.firstChild.nodeValue = input.value
                fold.classList.remove('active')
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
