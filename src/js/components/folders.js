import { SIDEBAR } from '../index'

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
                const filesChild = folder.querySelectorAll('.file')
                arrowsChild.forEach((arrow) => {
                    arrow.classList.remove('active_arrow')
                })
                foldersChild.forEach((folderChild) => {
                    folderChild.style.display = 'none'
                })
                filesChild.forEach((fileChild) => {
                    fileChild.style.display = 'none'
                })
            }
        }
    })
}

export {
    createFolder,
    closeFolder,
    getFolders,
    openFolder,
    removeFolder,
    renameFolder,
    getArrows,
}
