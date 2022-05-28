import { SIDEBAR } from '../index'

function createFolder(popupInput, parentFolder) {
    let folder = document.createElement('div')
    folder.className = 'folder'

    let name = document.createElement('span')
    name.className = 'folder__name'
    name.style.paddingLeft = '17px'

    let arrow = document.createElement('div')
    arrow.className = 'folder__arrow'
    arrow.style.left = '0'

    name.innerText = popupInput.value
    folder.append(arrow, name)

    if (popupInput.value.length > 0) {
        if (parentFolder === undefined) {
            folder.style.display = 'block'
            SIDEBAR.append(folder)
        } else {
            const folderName = folder.querySelector('.folder__name')
            const folderArrow = folder.querySelector('.folder__arrow')

            const parentFolderArrow =
                parentFolder.querySelector('.folder__arrow')
            const parentFolderName = parentFolder.querySelector('.folder__name')

            const left = parentFolderArrow.style.left
            const paddingLeft = parentFolderName.style.paddingLeft

            folderName.style.paddingLeft = parseInt(paddingLeft) + 17 + 'px'
            folderArrow.style.left = parseInt(left) + 17 + 'px'

            folder.className = 'folder active'
            parentFolder.append(folder)
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
            const folderParent = folder.parentNode
            const folderParentArrow =
                folderParent.querySelector('.folder__arrow')
            if (folderParent.children.length < 3) {
                folderParentArrow.classList.remove('active_arrow')
            }
            folder.remove()
        }
    })
}

function renameFolder(input) {
    getFolders().forEach((folder) => {
        if (folder.classList.contains('active')) {
            const folderName = folder.querySelector('.folder__name')
            if (input.value.length > 0) {
                folderName.innerText = input.value
                folder.classList.remove('active')
            }
        }
    })
}

function openFolder() {
    getFolders().forEach((folder) => {
        if (folder.classList.contains('active')) {
            const folderArrow = folder.querySelector('.folder__arrow')
            const folderChild = folder.querySelector('.folder')
            const fileChild = folder.querySelector('.file')

            if (folderChild || fileChild) {
                folder.classList.remove('active')
                folderArrow.classList.add('active_arrow')

                const folderChildren = folder.children
                let children = Array.prototype.slice.call(folderChildren)

                children.forEach((child) => {
                    child.style.display = 'block'
                })
            }
        }
    })
}

function closeFolder() {
    getFolders().forEach((folder) => {
        if (folder.classList.contains('active')) {
            const foldersArrows = folder.querySelectorAll('.active_arrow')
            const folderChildren = folder.querySelectorAll('.folder')
            const fileChildren = folder.querySelectorAll('.file')

            if (folderChildren || fileChildren) {
                foldersArrows.forEach((arrow) => {
                    arrow.classList.remove('active_arrow')
                })
                folderChildren.forEach((folderChild) => {
                    folderChild.style.display = 'none'
                })
                fileChildren.forEach((fileChild) => {
                    fileChild.style.display = 'none'
                })
            }
        }
    })
}

function callOpenOrCloseFolder(parent) {
    const folderChild = parent.querySelector('.folder')
    const fileChild = parent.querySelector('.file')

    if (folderChild) {
        folderChild.style.display === 'none' ? openFolder() : closeFolder()
    } else if (fileChild) {
        fileChild.style.display === 'none' ? openFolder() : closeFolder()
    }
}

export {
    createFolder,
    closeFolder,
    getFolders,
    openFolder,
    removeFolder,
    renameFolder,
    getArrows,
    callOpenOrCloseFolder,
}
