import { WRAPPER } from '../index'
import { getFiles } from './files'
import { getFolders } from './folders'

function createDescription(mouseX, mouseY, name) {
    const item = localStorage.getItem(name)
    const value = JSON.parse(item)
    const fileName = value.name
    const fileDescription = value.description

    let description = document.createElement('div')
    description.className = 'description'
    description.style.left = mouseX + 15 + 'px'
    description.style.top = mouseY + 15 + 'px'

    let title = document.createElement('p')
    title.className = 'description__title'
    title.innerText = fileName

    let content = document.createElement('div')
    content.className = 'description__content'
    content.innerText = fileDescription

    let editBtn = document.createElement('button')
    editBtn.className = 'description__edit'
    editBtn.innerText = 'Редактировать'

    description.append(title, content, editBtn)
    WRAPPER.append(description)
}

function showDescription(e) {
    e.preventDefault()
    const target = e.target
    getFiles().forEach((file) => {
        file.classList.remove('active')
    })
    getFolders().forEach((folder) => {
        folder.classList.remove('active')
    })
    if (getDescription()) getDescription().remove()

    if (target.closest('.file')) {
        target.classList.add('active')
        const name = target.innerText
        const mouseX = e.clientX
        const mouseY = e.clientY
        createDescription(mouseX, mouseY, name)
    }
}

function editDescription() {
    let area = document.createElement('textarea')
    area.className = 'description__area'
    area.value = getElements().content.innerText

    const content = getElements().content

    content.style.display = 'none'

    getElements().title.after(area)

    getElements().editBtn.innerText = 'Сохранить'
}

function saveDescription() {
    const content = getElements().content
    const area = getElements().area
    const name = getElements().title.innerText

    area.style.display = 'none'

    content.innerText = area.value
    content.style.display = 'block'

    getElements().editBtn.innerText = 'Редактировать'

    const item = localStorage.getItem(name)
    const value = JSON.parse(item)
    value.description = area.value
    localStorage.setItem(name, JSON.stringify(value))
}

function getElements() {
    return {
        content: document.querySelector('.description__content'),
        editBtn: document.querySelector('.description__edit'),
        title: document.querySelector('.description__title'),
        area: document.querySelector('.description__area'),
    }
}

function getDescription() {
    return document.querySelector('.description')
}

export {
    createDescription,
    showDescription,
    getDescription,
    editDescription,
    saveDescription,
}
