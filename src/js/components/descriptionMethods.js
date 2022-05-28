import { WRAPPER } from '../index'
import { common } from './common'

export const descriptionMethods = {
    createDescription(mouseX, mouseY, name) {
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

        description.append(title, content, editBtn)
        WRAPPER.append(description)
    },

    showDescription(e) {
        e.preventDefault()
        const target = e.target
        common.getFiles().forEach((file) => {
            file.classList.remove('active')
        })
        common.getFolders().forEach((folder) => {
            folder.classList.remove('active')
        })
        if (descriptionMethods.getDescription()) {
            descriptionMethods.getDescription().remove()
        }

        if (target.closest('.file')) {
            target.classList.add('active')
            const name = target.innerText
            const mouseX = e.clientX
            const mouseY = e.clientY
            descriptionMethods.createDescription(mouseX, mouseY, name)
        }
    },

    editDescription() {
        let editArea = document.createElement('textarea')
        editArea.className = 'description__area'
        editArea.setAttribute('maxlength', '70')
        editArea.value = this.getElements().content.innerText

        const content = this.getElements().content

        content.style.display = 'none'

        this.getElements().title.after(editArea)

        this.getElements().editBtn.classList.add('edit')
    },

    saveDescription() {
        const content = this.getElements().content
        const editArea = this.getElements().area
        const fileName = this.getElements().title.innerText

        editArea.style.display = 'none'

        content.innerText = editArea.value
        content.style.display = 'block'

        this.getElements().editBtn.classList.remove('edit')

        const item = localStorage.getItem(fileName)
        const value = JSON.parse(item)
        value.description = editArea.value
        localStorage.setItem(fileName, JSON.stringify(value))
    },

    getElements() {
        return {
            content: document.querySelector('.description__content'),
            editBtn: document.querySelector('.description__edit'),
            title: document.querySelector('.description__title'),
            area: document.querySelector('.description__area'),
        }
    },

    getDescription() {
        return document.querySelector('.description')
    },
}
